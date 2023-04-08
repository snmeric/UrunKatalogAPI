using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrunKatalogAPI.Core.Domain.Entities
{
    public class Condition : BaseEntity
    {

        public string Status { get; set; }

        public string Description { get; set; }


    }
}
