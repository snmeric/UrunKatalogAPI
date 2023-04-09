﻿using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Domain.Entities;

namespace UrunKatalogAPI.Core.Shared.Validators
{
    public class ProductValidator : AbstractValidator<Product>
    {
        public ProductValidator()
        {
            RuleFor(p => p.Name).NotEmpty().NotNull().MaximumLength(100);
            RuleFor(p => p.Description).NotEmpty().NotNull();
            RuleFor(p => p.CategoryId).NotEmpty().NotNull();
            RuleFor(p => p.ProductCondition).NotEmpty().NotNull();
            //RuleFor(p => p.Image).NotEmpty().NotNull();
            RuleFor(p => p.Price).NotEmpty().NotNull();
            RuleFor(p => p.IsOfferable).NotEmpty().NotNull();
        }
    }
}
