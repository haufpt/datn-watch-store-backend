var express = require("express");
var router = express.Router();
const cartController = require("../../../controller/cart/cart");
const { checkLogin, checkPermission } = require("../../../middleware/auth");
const { AccountRoleEnum } = require("../../../common/enum");

router.get(
  "/",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  cartController.getListCart
);

module.exports = router;
