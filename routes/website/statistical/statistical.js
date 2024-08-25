var express = require("express");
var router = express.Router();
var statisticalController = require("../../../controller/admin/statistical/statisticalController");
const {checkRole} = require("../../../middleware/auth");
const { AccountRoleEnum, FileTypeEnum } = require("../../../common/enum");

router.get(
  "/statisticalStore",
  checkRole([AccountRoleEnum.ADMIN, AccountRoleEnum.STAFF]),
  statisticalController.statisticalStore
);

module.exports = router;