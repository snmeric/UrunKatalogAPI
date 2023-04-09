using UrunKatalogAPI.API.Middlewares;

namespace UrunKatalogAPI.API.Extensions
{
    public static class CustomGlobalExceptionExtension
    {
        // to use in start.cs : app.UseCustomGlobalException() instead of app.UseMiddleware<CustomGlobalException>();
        public static IApplicationBuilder UseCustomGlobalException(this IApplicationBuilder builder)
        {

            return builder.UseMiddleware<CustomGlobalException>();
        }
    }
}
