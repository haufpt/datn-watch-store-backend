const express = require("express");
const { required } = require("joi");
const router = express.Router();
const brandController = require("../../../controller/admin/brands/brandController");
const { checkRole } = require("../../../middleware/auth");
const { AccountRoleEnum, FileTypeEnum } = require("../../../common/enum");
const multerService = require("../../../shared/multer");
const checkFile = require("../../../middleware/file");

router.get(
  "/list-brands",
  checkRole([AccountRoleEnum.ADMIN]),
  brandController.listBrand
);
router.get(
  "/detail-brands/:idBrand",
  checkRole([AccountRoleEnum.ADMIN]),
  brandController.detailBrand
);

router.post(
  "/post-brands",
  checkRole([AccountRoleEnum.ADMIN]),
  multerService.uploadFile(FileTypeEnum.IMAGE).single("file"),
  checkFile("SINGLE"),
  brandController.postBrand
);

router.put(
  "/update-brand/:idBrand",
  checkRole([AccountRoleEnum.ADMIN]),
  multerService.uploadFile(FileTypeEnum.IMAGE).single("file"),
  brandController.updateBrand
);

module.exports = router;
