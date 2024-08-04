const Joi = require("joi");

class NotifyValidation {
  static readNotify = {
    param: Joi.object({
      notifyId: Joi.string().required(),
    }),
  };
}

module.exports = NotifyValidation;
