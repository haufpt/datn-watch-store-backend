const Joi = require("joi");
const { PaymentStatusEnum } = require("../common/enum");

class OrderValidation {
  static confirmOrder = {
    param: Joi.object().keys({
      orderId: Joi.string().max(255).required(),
    }),
    body: Joi.object().keys({
      shippingAddressId: Joi.string().max(255).required(),
      discountId: Joi.string().max(255).optional(),
      paymentMethod: Joi.string()
        .valid(...Object.values(PaymentStatusEnum))
        .required(),
    }),
  };

  static createPayment = {
    param: Joi.object().keys({
      orderId: Joi.string().max(255).required(),
    }),
    body: Joi.object().keys({
      shippingAddressId: Joi.string().max(255).required(),
      discountId: Joi.string().max(255).optional(),
    }),
  };
}

module.exports = OrderValidation;
