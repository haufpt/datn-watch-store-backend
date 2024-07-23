var express = require("express");
var router = express.Router();
const discountController = require("../../../controller/discount/discount");
const { checkLogin, checkPermission } = require("../../../middleware/auth");
const { AccountRoleEnum } = require("../../../common/enum");
const { validateSchema } = require("../../../middleware/validate");

router.get(
  "/",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  discountController.getListDiscountByUser
);

module.exports = router;
