using Newtonsoft.Json;
using System.Net;

namespace UrunKatalogAPI.API.Extensions.Middlewares
{
    public class CustomGlobalException
    {

        private readonly RequestDelegate _next;

        public CustomGlobalException(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {

            try
            {
                await _next(context);

            }
            catch (Exception ex)
            {
                await HandleException(context, ex);
            }
        }


        //global exception
        private Task HandleException(HttpContext context, Exception ex)
        {
            context.Response.ContentType = "application/json";

            switch (ex)
            {
                case KeyNotFoundException:
                    context.Response.StatusCode = (int)HttpStatusCode.NotFound; //404 if not found
                    break;
                default:
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError; //500 if unexpected
                    break;
            }


            //Use Newtonsoft to serialize ex.Message to json and return to client
            var result = JsonConvert.SerializeObject(new { error = ex.Message }, Formatting.None);
            return context.Response.WriteAsync(result);
        }



    }
}
