const Joi = require("joi");

class ShippingAddressValidation {
  static createNewShippingAddress = Joi.object({
    title: Joi.string().max(255).required(),
    address: Joi.string().required(),
    phoneNumber: Joi.string().max(255).trim().required(),
    isDefault: Joi.boolean().optional(),
  });

  static updateShippingAddress = Joi.object({
    title: Joi.string().max(255).optional(),
    address: Joi.string().optional(),
    phoneNumber: Joi.string().max(255).trim().optional(),
  });
}

module.exports = ShippingAddressValidation;
