namespace UrunKatalogAPI.Infrastructere.Services.SendMail
{
    public interface ISendEmailJob
    {
        public void DoLogInJob(string recipientEmail);
        public void DoRegisterJob(string recipientEmail);
    }
}
