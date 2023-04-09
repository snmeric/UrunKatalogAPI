using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Domain.Entities;

namespace UrunKatalogAPI.Core.Shared.Validators
{
    public class RegisterValidator : AbstractValidator<RegisterModel>
    {
        public RegisterValidator()
        {
            RuleFor(r => r.Username).NotEmpty().NotNull();
            RuleFor(r => r.Email).EmailAddress().NotEmpty().NotNull();
            RuleFor(r => r.Password).NotEmpty().NotNull().Length(8, 20).WithMessage("Şifre en az 8, en fazla 20 karakter olmalıdır.");
        }
    }
}
