var express = require("express");
var router = express.Router();
var notifyController = require("../../../controller/admin/notify/notifyController");
const {checkRole} = require("../../../middleware/auth");
const { AccountRoleEnum, FileTypeEnum } = require("../../../common/enum");

router.get(
  "/managerNotify",
  checkRole([AccountRoleEnum.ADMIN, AccountRoleEnum.STAFF]),
  notifyController.managerNotify
);

module.exports = router;