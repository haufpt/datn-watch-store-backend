var express = require("express");
var router = express.Router();
const shippingAddressController = require("../../../controller/shipping_address/shipping_address");
const { checkLogin, checkPermission } = require("../../../middleware/auth");
const { AccountRoleEnum } = require("../../../common/enum");
const ShippingAddressValidation = require("../../../validation/shipping_address");

router.get(
  "/",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  shippingAddressController.getListShippingAddress
);

module.exports = router;
