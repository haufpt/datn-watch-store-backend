var express = require("express");
var router = express.Router();
const discountController = require("../../../controller/discount/discount");
const { checkLogin, checkPermission } = require("../../../middleware/auth");
const { AccountRoleEnum } = require("../../../common/enum");
const { validateSchema } = require("../../../middleware/validate");
const DiscountValidation = require("../../../validation/discount");

router.get(
  "/",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  discountController.getListDiscountByUser
);

router.put(
  "/:discountId",
  validateSchema(DiscountValidation.updateDiscount),
  discountController.updateDiscount
);

router.delete("/:discountId", discountController.deleteDiscount);

module.exports = router;
