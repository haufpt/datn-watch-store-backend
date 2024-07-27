var express = require("express");
var router = express.Router();
var promotionController = require("../../../controller/admin/promotion/promotionController");
const {checkRole} = require("../../../middleware/auth");
const { AccountRoleEnum, FileTypeEnum } = require("../../../common/enum");

router.get(
  "/promotion",
  checkRole([AccountRoleEnum.ADMIN]),
  promotionController.getListPromotion
);
module.exports = router;
