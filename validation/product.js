const Joi = require("joi");
const {
  MachineCategoryEnum,
  WireCategoryEnum,
  TopProductTypeEnum,
} = require("../common/enum");
const { param } = require("../routes/api/product/product");

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

  static getProduct = {
    query: Joi.object().keys({
      brandId: Joi.string().max(255).optional(),
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).optional(),
      type: Joi.string()
        .valid(...Object.values(TopProductTypeEnum))
        .optional(),
    }),
  };

  static getDetailProduct = {
    param: Joi.object().keys({
      idProduct: Joi.string().max(255).required(),
    }),
  };
}

module.exports = ProductValidation;
