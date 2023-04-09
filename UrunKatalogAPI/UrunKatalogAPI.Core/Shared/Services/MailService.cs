//using Microsoft.Extensions.Options;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Net.Mail;
//using System.Net;
//using System.Text;
//using System.Threading.Tasks;

//namespace UrunKatalogAPI.Core.Shared.Services
//{
//    public class MailService : IMailService
//    {
//        private readonly SmtpSettings _smtpSettings;
//        public MailService(IOptions<SmtpSettings> smtpSettings)
//        {
//            _smtpSettings = smtpSettings.Value;
//        }

//        public async Task<string> SendLogInEmailAsync(string recipientEmail, string recipientFirstName)
//        {
//            var message = new MimeMessage();
//            message.From.Add(MailboxAddress.Parse(_smtpSettings.SenderEmail));
//            message.To.Add(MailboxAddress.Parse(recipientEmail));
//            message.Subject = "Mezuniyet Projesi";
//            message.Body = new TextPart("plain")
//            {
//                Text = "Hesabınız bloke olmuştur."
//            };

//            var client = new SmtpClient();

//            try
//            {
//                client.Connect(_smtpSettings.Server, _smtpSettings.Port, true);
//                client.Authenticate(new NetworkCredential(_smtpSettings.SenderEmail, _smtpSettings.Password));
//                client.Send(message);
//                client.Disconnect(true);
//                return "Email gönderildi";
//            }
//            catch (Exception ex)
//            {

//                throw ex;
//            }
//            finally
//            {
//                client.Dispose();
//            }
//        }

//        public async Task<string> SendRegisterEmailAsync(string recipientEmail, string recipientFirstName)
//        {
//            var message = new MimeMessage();
//            message.From.Add(MailboxAddress.Parse(_smtpSettings.SenderEmail));
//            message.To.Add(MailboxAddress.Parse(recipientEmail));
//            message.Subject = "Bloke";
//            message.Body = new TextPart("plain")
//            {
//                Text = "HOŞGELDİNİZ."
//            };

//            var client = new SmtpClient();

//            try
//            {
//                client.Connect(_smtpSettings.Server, _smtpSettings.Port, true);
//                client.Authenticate(new NetworkCredential(_smtpSettings.SenderEmail, _smtpSettings.Password));
//                client.Send(message);
//                client.Disconnect(true);
//                return "Email gönderildi";
//            }
//            catch (Exception ex)
//            {

//                throw ex;
//            }
//            finally
//            {
//                client.Dispose();
//            }
//        }
//    }
//}
