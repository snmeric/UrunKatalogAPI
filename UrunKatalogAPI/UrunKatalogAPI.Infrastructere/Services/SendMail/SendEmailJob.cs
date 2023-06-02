using Hangfire;
using UrunKatalogAPI.Infrastructere.Services;
using UrunKatalogAPI.Infrastructere.Repositories;

namespace UrunKatalogAPI.Infrastructere.Services.SendMail
{
    public class SendEmailJob:ISendEmailJob
    {
        public IMailService mailService;

        public SendEmailJob(IMailService mailService)
        {
            this.mailService = mailService;


        }
        [AutomaticRetry(Attempts = 5, OnAttemptsExceeded = AttemptsExceededAction.Fail)] 
        public void DoLogInJob(string recipientEmail)
        {

            mailService.SendLogInEmailAsync(recipientEmail); 

        }

        public void DoRegisterJob(string recipientEmail)
        {
            mailService.SendRegisterEmailAsync(recipientEmail);
        }
    }
}
