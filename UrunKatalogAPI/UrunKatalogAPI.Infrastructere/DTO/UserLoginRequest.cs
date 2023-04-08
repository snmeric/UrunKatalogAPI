using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrunKatalogAPI.Infrastructere.DTO
{
    public class UserLoginRequest
    {
        [Required(ErrorMessage = "Lütfen Email Adresini Boş Bırakmayınız!")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Lütfen Şifre Alanını Boş Bırakmayınız!")]
        public string Password { get; set; }
    }
}
