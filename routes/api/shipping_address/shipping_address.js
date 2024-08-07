var express = require("express");
var router = express.Router();
const shippingAddressController = require("../../../controller/shipping_address/shipping_address");
const { checkLogin, checkPermission } = require("../../../middleware/auth");
const { AccountRoleEnum } = require("../../../common/enum");
const ShippingAddressValidation = require("../../../validation/shipping_address");
const { validateSchema } = require("../../../middleware/validate");

router.get(
  "/",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  shippingAddressController.getListShippingAddress
);

router.post(
  "/new",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  validateSchema(ShippingAddressValidation.createNewShippingAddress),
  shippingAddressController.createNewShippingAddress
);

router.put(
  "/:shippingAddressId/set-default",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  shippingAddressController.setShippingAddressDefault
);

router.put(
  "/:shippingAddressId",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  validateSchema(ShippingAddressValidation.updateShippingAddress),
  shippingAddressController.updateShippingAddress
);

router.delete(
  "/:shippingAddressId",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  shippingAddressController.deleteShippingAddress
);

module.exports = router;
