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

module.exports = router;
