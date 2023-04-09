using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrunKatalogAPI.Core.Domain.Entities
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
