var express = require("express");
var router = express.Router();
const accountController = require("../../../controller/account/account");
const { checkLogin, checkPermission } = require("../../../middleware/auth");
const { AccountRoleEnum, FileTypeEnum } = require("../../../common/enum");
const multerService = require("../../../shared/multer");

router.put(
  "/",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  multerService.uploadFile(FileTypeEnum.IMAGE).single("file"),
  accountController.updateProfile
);

module.exports = router;
