var express = require("express");
var router = express.Router();
const { checkRole } = require("../../../middleware/auth");
var accController = require("../../../controller/admin/user/accountController");
const { AccountRoleEnum, FileTypeEnum } = require("../../../common/enum");

router.use(
  "/list-user",
  checkRole([AccountRoleEnum.ADMIN, AccountRoleEnum.STAFF]),
  accController.listUser
);

router.use(
  "/list-staff",
  checkRole([AccountRoleEnum.ADMIN, AccountRoleEnum.STAFF]),
  accController.listStaff
);

router.use(
  "/detail-user/:idAccount",
  checkRole([AccountRoleEnum.ADMIN, AccountRoleEnum.STAFF]),
  accController.detailUser
);

router.use(
  "/detail-staff/:idAccount",
  checkRole([AccountRoleEnum.ADMIN, AccountRoleEnum.STAFF]),
  accController.detailStaff
);

module.exports = router;
