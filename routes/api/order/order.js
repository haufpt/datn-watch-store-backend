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

module.exports = router;
