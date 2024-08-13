var express = require("express");
var router = express.Router();
const accountController = require("../../../controller/account/account");
const { checkLogin, checkPermission, checkRole } = require("../../../middleware/auth");
const { AccountRoleEnum, FileTypeEnum } = require("../../../common/enum");
const multerService = require("../../../shared/multer");
const { validateSchema } = require("../../../middleware/validate");
const AccountValidation = require("../../../validation/account");

router.put(
  "/",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  multerService.uploadFile(FileTypeEnum.IMAGE).single("file"),
  accountController.updateProfile
);

router.put(
  "/change-password",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  validateSchema(AccountValidation.changePassword),
  accountController.changePassword
);

router.put(
  "/:idAccount/change-status",
  accountController.changeStatus
);

module.exports = router;
