const Joi = require("joi");
const {
  OsPlatformEnum,
  MachineCategoryEnum,
  WireCategoryEnum,
} = require("../common/enum");

class ProductValidation {
  static addProduct = Joi.object({
    brandId: Joi.string().max(255).required(),
    name: Joi.string().max(255).required(),
    description: Joi.string().max(255).trim().required(),
    price: Joi.number().precision(2).required(),
    quantity: Joi.number().integer().required(),
    size: Joi.number().precision(2).required(),
    machineCategory: Joi.string()
      .valid(...Object.values(MachineCategoryEnum))
      .required(),
    wireCategory: Joi.string()
      .valid(...Object.values(WireCategoryEnum))
      .required(),
  });
}

module.exports = ProductValidation;
