var express = require("express");
var router = express.Router();
const notifyController = require("../../../controller/notify/notify");
const { checkLogin, checkPermission } = require("../../../middleware/auth");
const { AccountRoleEnum } = require("../../../common/enum");

router.get(
  "/",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  notifyController.getListNotify
);

router.put(
  "/read-notify",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  notifyController.readNotify
);

module.exports = router;
