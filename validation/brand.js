const Joi = require("joi");

class BrandValidation {
  static getBrand = {
    query: Joi.object().keys({
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).optional(),
    }),
  };
  static addBrand = Joi.object({
    name: Joi.string().max(255).required(),
    description: Joi.string().max(255).trim().required()
  });
}


module.exports =  BrandValidation;
