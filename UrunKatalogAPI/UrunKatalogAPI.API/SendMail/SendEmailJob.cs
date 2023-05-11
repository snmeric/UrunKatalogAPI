using Hangfire;
using UrunKatalogAPI.Core.Shared.Service;
using UrunKatalogAPI.Infrastructere.Repositories;

namespace UrunKatalogAPI.API.SendMail
{
    public class SendEmailJob:ISendEmailJob
    {
        public IMailService mailService;

        public SendEmailJob(IMailService mailService)
        {
            this.mailService = mailService;


        }
        [AutomaticRetry(Attempts = 5, OnAttemptsExceeded = AttemptsExceededAction.Fail)] // 5 kez yapmayı dene yapamazsan fail tablosuna at
        public void DoLogInJob(string recipientEmail)
        {

            mailService.SendLogInEmailAsync(recipientEmail); // mail yollama 

        }

        public void DoRegisterJob(string recipientEmail)
        {
            mailService.SendRegisterEmailAsync(recipientEmail);
        }
    }
}
