var express = require("express");
var router = express.Router();
const notifyController = require("../../../controller/notify/notify");
const { checkLogin, checkPermission } = require("../../../middleware/auth");
const { AccountRoleEnum } = require("../../../common/enum");
const { validateSchema } = require("../../../middleware/validate");
const NotifyValidation = require("../../../validation/notify");

router.get(
  "/",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  notifyController.getListNotify
);

router.put(
  "/:notifyId",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  validateSchema(NotifyValidation.readNotify),
  notifyController.readNotify
);

module.exports = router;
