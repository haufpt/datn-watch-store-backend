const Joi = require("joi");

class AccountValidation {
  static updateProfile = Joi.object({
    userName: Joi.string().max(255).optional(),
    email: Joi.string().max(255).optional(),
  });

  static updateAcount = Joi.object({
    userName: Joi.string().max(255).optional(),
    email: Joi.string().max(255).optional(),
    name: Joi.string().max(255).optional(),
    phoneNumber: Joi.string().max(255).optional(),
  });

  static changePassword = {
    body: Joi.object({
      oldPassword: Joi.string().max(255).required(),
      newPassword: Joi.string().max(255).required(),
    }),
  };
}

module.exports = AccountValidation;
