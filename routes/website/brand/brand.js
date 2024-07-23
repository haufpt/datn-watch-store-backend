const express = require("express");
const { required } = require("joi");
const router = express.Router();
const brandController = require("../../../controller/admin/brands/brandController")
const { checkLogin, checkPermission } = require("../../../middleware/auth");
const { AccountRoleEnum, FileTypeEnum } = require("../../../common/enum");
const multerService = require("../../../shared/multer");
const checkFile = require("../../../middleware/file");

router.get("/list-brands", brandController.listBrand);
router.get("/detail-brands/:idBrand", brandController.detailBrand);

router.post("/post-brands", 
    multerService.uploadFile(FileTypeEnum.IMAGE).single("file"),
    checkFile("SINGLE"),
    brandController.postBrand);

module.exports = router;
