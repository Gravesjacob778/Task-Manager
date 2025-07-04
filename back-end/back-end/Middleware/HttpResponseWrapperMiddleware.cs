using back_end.Model;
using System.Text.Json;

namespace back_end.Middleware
{
    public class HttpResponseWrapperMiddleware(RequestDelegate next, ILogger<HttpResponseWrapperMiddleware> logger)
    {
        private readonly RequestDelegate _next = next;
        private readonly ILogger<HttpResponseWrapperMiddleware> _logger = logger;

        public async Task InvokeAsync(HttpContext context)
        {
            // Capture the original response body stream
            var originalBodyStream = context.Response.Body;

            // Use a memory stream to capture the response
            using var responseBody = new MemoryStream();
            context.Response.Body = responseBody;

            try
            {
                await _next(context);

                // If the response is 204 (No Content), do not write anything to the body.
                if (context.Response.StatusCode == StatusCodes.Status204NoContent)
                {
                    responseBody.Seek(0, SeekOrigin.Begin);
                    await responseBody.CopyToAsync(originalBodyStream);
                    return;
                }

                // If the response is successful (2xx) and not already wrapped, wrap it
                if (context.Response.StatusCode >= 200 && context.Response.StatusCode < 300)
                {
                    // Rewind the stream to read its content
                    responseBody.Seek(0, SeekOrigin.Begin);
                    var responseContent = await new StreamReader(responseBody).ReadToEndAsync();

                    // Check if the response is already wrapped
                    if (!IsAlreadyWrapped(responseContent))
                    {
                        var data = string.IsNullOrEmpty(responseContent) ? null : JsonSerializer.Deserialize<object>(responseContent);
                        var wrappedResponse = HttpActionResponse<object>.Ok(data, "Success");
                        await WriteWrappedResponse(context, wrappedResponse, originalBodyStream);
                    }
                    else
                    {
                        // If already wrapped, just copy the content back
                        responseBody.Seek(0, SeekOrigin.Begin);
                        await responseBody.CopyToAsync(originalBodyStream);
                    }
                }
                // If the response is an error (4xx, 5xx) and no content has been written, wrap it
                else if (context.Response.StatusCode >= 400 && context.Response.StatusCode < 600)
                {
                    responseBody.Seek(0, SeekOrigin.Begin);
                    var responseContent = await new StreamReader(responseBody).ReadToEndAsync();

                    if (string.IsNullOrEmpty(responseContent))
                    {
                        var message = $"Error: {context.Response.StatusCode}";
                        var wrappedResponse = HttpActionResponse<object>.Fail(message);
                        await WriteWrappedResponse(context, wrappedResponse, originalBodyStream);
                    }
                    else
                    {
                        // If there's already content, just copy it back
                        responseBody.Seek(0, SeekOrigin.Begin);
                        await responseBody.CopyToAsync(originalBodyStream);
                    }
                }
                else
                {
                    // For other status codes (e.g., 3xx redirects), just copy the content back
                    responseBody.Seek(0, SeekOrigin.Begin);
                    await responseBody.CopyToAsync(originalBodyStream);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred.");
                if (!context.Response.HasStarted)
                {
                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                    var wrappedResponse = HttpActionResponse<object>.Fail("An unexpected error occurred.");
                    await WriteWrappedResponse(context, wrappedResponse, originalBodyStream);
                }
                else
                {
                    // If the response has already started, we cannot modify the status code or body.
                    // Just re-throw the exception or log it.
                    _logger.LogWarning("Response has already started, cannot write error response for unhandled exception.");
                    throw; // Re-throw the original exception
                }
            }
            finally
            {
                context.Response.Body = originalBodyStream; // Restore the original stream
            }
        }

        private static async Task WriteWrappedResponse<T>(HttpContext context, HttpActionResponse<T> wrappedResponse, Stream originalBodyStream)
        {
            context.Response.ContentType = "application/json";
            var jsonResponse = JsonSerializer.Serialize(wrappedResponse, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
            await originalBodyStream.WriteAsync(System.Text.Encoding.UTF8.GetBytes(jsonResponse));
        }

        private static bool IsAlreadyWrapped(string json)
        {
            if (string.IsNullOrEmpty(json)) return false;
            try
            {
                using JsonDocument doc = JsonDocument.Parse(json);
                var root = doc.RootElement;
                // If the root element is not an object, it's not our wrapped response
                if (root.ValueKind != JsonValueKind.Object)
                {
                    return false;
                }
                return root.TryGetProperty("success", out _) &&
                       root.TryGetProperty("message", out _) &&
                       root.TryGetProperty("data", out _);
            }
            catch (JsonException)
            {
                return false;
            }
        }
    }
}
