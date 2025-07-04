namespace back_end.Model
{
    public class HttpActionResponse<T>
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }

        public static HttpActionResponse<T> Ok(T data, string? message = null) =>
            new() { Success = true, Data = data, Message = message };

        public static HttpActionResponse<T> Fail(string message) =>
            new() { Success = false, Message = message };
    }
}
