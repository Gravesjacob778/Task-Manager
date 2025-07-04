using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using back_end.Model;
namespace back_end.Infrastructure.Filters
{
    public class WrapResponseFilter : IAsyncResultFilter
    {
        public async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
        {
            if (context.Result is ObjectResult result &&
                result.Value is not HttpActionResponse<object>)
            {
                var wrapped = HttpActionResponse<object>.Ok(result.Value!);
                context.Result = new ObjectResult(wrapped)
                {
                    StatusCode = result.StatusCode
                };
            }
            await next();
        }
    }
}
