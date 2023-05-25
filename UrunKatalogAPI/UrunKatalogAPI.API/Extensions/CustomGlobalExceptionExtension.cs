using UrunKatalogAPI.API.Middlewares;

namespace UrunKatalogAPI.API.Extensions
{
    public static class CustomGlobalExceptionExtension
    {
       
        public static IApplicationBuilder UseCustomGlobalException(this IApplicationBuilder builder)
        {

            return builder.UseMiddleware<CustomGlobalException>();
        }
    }
}
