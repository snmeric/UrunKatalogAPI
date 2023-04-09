using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Domain.Entities;

namespace UrunKatalogAPI.Core.Shared.Validators
{
    public class LoginValidator : AbstractValidator<LoginModel>
    {
        public LoginValidator()
        {
            RuleFor(l => l.Email).EmailAddress().NotEmpty().NotNull();
            RuleFor(l => l.Password).NotEmpty().NotNull().Length(8, 20).WithMessage("Şifre en az 8, en fazla 20 karakter olmalıdır."); ;

        }
    }
}
