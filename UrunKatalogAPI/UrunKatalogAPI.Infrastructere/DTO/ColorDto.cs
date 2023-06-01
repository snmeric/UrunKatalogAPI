using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrunKatalogAPI.Infrastructere.DTO
{
    public class ColorDto : EntityDto
    {
        public string Name { get; set; }
    }
    public class CreateColorInput
    {
        [Required]
        public string Name { get; set; }



    }
    public class UpdateColorInput : CreateColorInput
    {
        [Required]
        public int Id { get; set; }
       
    }
}
