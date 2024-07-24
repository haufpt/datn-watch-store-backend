var express = require("express");
var router = express.Router();
const orderController = require("../../../controller/order/order");
const { checkLogin, checkPermission } = require("../../../middleware/auth");
const { AccountRoleEnum } = require("../../../common/enum");
const { validateSchema } = require("../../../middleware/validate");
const OrderValidation = require("../../../validation/order");

router.post(
  "/proccess",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  orderController.proccessOrder
);

router.post(
  "/:orderId/confirm",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  validateSchema(OrderValidation.confirmOrder),
  orderController.confirmOrder
);

router.post(
  "/:orderId/create-payment",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  validateSchema(OrderValidation.createPayment),
  orderController.createPayment
);

router.get(
  "/:orderId/check-payment",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  validateSchema(OrderValidation.checkPayment),
  orderController.checkPayment
);

router.get("/vnpay-return", orderController.vnpay_return);

module.exports = router;
