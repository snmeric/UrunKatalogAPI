using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrunKatalogAPI.Core.Domain.Entities
{
    public class LoginModel
    {
        //[Required]
        //public string UserName { get; set; }

        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
