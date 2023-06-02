using UrunKatalogAPI.API.Extensions.Middlewares;

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
