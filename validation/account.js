const Joi = require("joi");

class AccountValidation {
  static updateProfile = Joi.object({
    userName: Joi.string().max(255).optional(),
      email: Joi.string().max(255).optional(),
  });
}

module.exports = AccountValidation;
