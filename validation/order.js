const Joi = require("joi");
const { PaymentStatusEnum, OrderStatusEnum } = require("../common/enum");

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

  static checkPayment = {
    param: Joi.object().keys({
      orderId: Joi.string().max(255).required(),
    }),
  };

  static getListOrderByClient = {
    query: Joi.object().keys({
      status: Joi.string()
        .valid(...Object.values(OrderStatusEnum))
        .optional(),
    }),
  };

  static cancelOrder = {
    param: Joi.object().keys({
      orderId: Joi.string().max(255).required(),
    }),
    body: Joi.object().keys({
      reason: Joi.string().required(),
    }),
  };
}

module.exports = OrderValidation;
