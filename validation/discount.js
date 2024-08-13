const Joi = require("joi");
const { DiscountTypeEnum } = require("../common/enum");
const { param } = require("../routes/api/discount/discount");

class DiscountValidation {
  static addDiscount = Joi.object({
    content: Joi.string().max(255).required(),
    createdDate: Joi.date().iso().required(),
    discountValue: Joi.number().integer().required(),
    expirationDate: Joi.date().iso().required(),
    discountType: Joi.string()
      .valid(...Object.values(DiscountTypeEnum))
      .required(),
  });

  static updateDiscount = Joi.object({
    content: Joi.string().max(255).optional(),
    createdDate: Joi.date().iso().optional(),
    discountValue: Joi.number().integer().optional(),
    expirationDate: Joi.date().iso().optional(),
    discountType: Joi.string()
      .valid(...Object.values(DiscountTypeEnum))
      .optional(),
  });
}

module.exports = DiscountValidation;
