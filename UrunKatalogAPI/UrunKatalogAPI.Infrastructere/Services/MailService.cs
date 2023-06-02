using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;
using System.Net;

namespace UrunKatalogAPI.Infrastructere.Services
{
    public class MailService : IMailService
    {
        private readonly SmtpSettings _smtpSettings;
        public MailService(IOptions<SmtpSettings> smtpSettings)
        {
            _smtpSettings = smtpSettings.Value;
        }

        public async Task<string> SendLogInEmailAsync(string recipientEmail)
        {
            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(_smtpSettings.SenderEmail));
            message.To.Add(MailboxAddress.Parse(recipientEmail));
            message.Subject = "Urun Katalog Projesi";
            message.Body = new TextPart(TextFormat.Html)
            {
                Text = "Birden fazla hatalı girişinizden dolayı hesabınız bloke edilmiştir!"
            };

           var client = new SmtpClient();

            try
            {
                client.Connect(_smtpSettings.Server, _smtpSettings.Port, SecureSocketOptions.StartTls);
                client.Authenticate(_smtpSettings.SenderEmail, _smtpSettings.Password);
                client.Send(message);
                client.Disconnect(true);
                return "Email gönderildi";
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                client.Dispose();
            }
        }

        public async Task<string> SendRegisterEmailAsync(string recipientEmail)
        {
            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(_smtpSettings.SenderEmail));
            message.To.Add(MailboxAddress.Parse(recipientEmail));
            message.Subject = "Welcome";
            message.Body = new TextPart(TextFormat.Html)
            {
                Text = "Ürün Katalog Projeme kayıt olduğunuz için teşekkürler. Hoşgeldiniz :)"
            };

           using var client = new SmtpClient();

            try
            {
                client.Connect(_smtpSettings.Server, _smtpSettings.Port, SecureSocketOptions.StartTls);
                client.Authenticate(new NetworkCredential(_smtpSettings.SenderEmail, _smtpSettings.Password));
                client.Send(message);
                client.Disconnect(true);
                return "Email başarılı bir şekilde gönderildi.";
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                client.Dispose();
            }
        }
    }
}
