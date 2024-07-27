var express = require("express");
var router = express.Router();
const { checkRole } = require("../../../middleware/auth");
var accController = require("../../../controller/admin/user/accountController");
const { AccountRoleEnum, FileTypeEnum } = require("../../../common/enum");

router.use("/list-user", checkRole(["ADMIN"]), accController.listUser);

router.use(
  "/detail-user/:idAccount",
  checkRole([AccountRoleEnum.ADMIN]),
  accController.detailUser
);

module.exports = router;
