const Joi = require("joi");
const { NotificationTypeEnum } = require("../common/enum");

class NotifyValidation {
  static readNotify = {
    param: Joi.object({
      notifyId: Joi.string().required(),
    }),
  };

  static createNotify = {
    body: Joi.object({
      title: Joi.string().required(),
      message: Joi.string().required(),
      type: Joi.string()
        .valid(...Object.values(NotificationTypeEnum))
        .required(),
    }),
  };

  static updateNotify = {
    body: Joi.object({
      title: Joi.string().optional(),
      message: Joi.string().optional(),
      type: Joi.string()
        .valid(...Object.values(NotificationTypeEnum))
        .optional(),
    }),
  };
}

module.exports = NotifyValidation;
