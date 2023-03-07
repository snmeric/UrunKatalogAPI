using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Enum;

namespace UrunKatalogAPI.Core.Models
{
    public class Mail
    {
        public int Id { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedById { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; }
    }
}
