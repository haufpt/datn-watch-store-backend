var express = require("express");
var router = express.Router();
var orderController = require("../../../controller/admin/order/orderController");
const { checkLogin, checkPermission, checkRole} = require("../../../middleware/auth");
const { AccountRoleEnum, FileTypeEnum } = require("../../../common/enum");

router.get(
  "/list-order",
  checkRole([AccountRoleEnum.ADMIN]),
  orderController.listOrder
);
router.get(
  "/detail-order/:orderId",
  checkRole([AccountRoleEnum.ADMIN]),
  orderController.getDetailOrder
);
router.post(
  "/update-order/:orderId",
  checkRole([AccountRoleEnum.ADMIN]),
  orderController.putOrder
);

module.exports = router;
