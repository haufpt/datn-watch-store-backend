const Joi = require("joi");
const { OsPlatformEnum } = require("../common/enum");

class AuthValidation {
  static login = {
    body: Joi.object().keys({
      userName: Joi.string().max(255).required(),
      password: Joi.string().max(255).trim().required(),
      firebase: Joi.object()
        .keys({
          deviceId: Joi.string().max(255).trim().required(),
          token: Joi.string().max(255).trim().required(),
          osPlatform: Joi.string()
            .valid(...Object.values(OsPlatformEnum))
            .required(),
        })
        .optional(),
    }),
  };

  static signup = {
    body: Joi.object().keys({
      name: Joi.string().max(255).required(),
      userName: Joi.string().max(255).required(),
      email: Joi.string().email().max(255).required(),
      phoneNumber: Joi.string().required(),
      password: Joi.string().max(255).trim().required(),
    }),
  };

  static logout = {
    body: Joi.object().keys({
      deviceId: Joi.string().max(255).optional(),
    }),
  };
}

module.exports = AuthValidation;
