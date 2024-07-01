const express = require("express");
const multer = require("multer");
const router = express.Router();
const brandController = require("../../../controller/brand/brand");
const { checkLogin, checkPermission } = require("../../../middleware/auth");
const { validateSchema } = require("../../../middleware/validate");
const BrandValidation = require("../../../validation/brand");
const { AccountRoleEnum } = require("../../../common/enum");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const fileConfig = `${file.fieldname}-${Date.now()}-${file.originalname}`;
    cb(null, fileConfig);
  },
});
var upload = multer({ storage: storage });

router.post(
  "/post-brand",
  upload.fields([{ name: "logo", maxCount: 1 }]),
  brandController.postBrand
);

router.get(
  "/",
  checkLogin,
  checkPermission([AccountRoleEnum.ADMIN, AccountRoleEnum.CLIENT]),
  validateSchema(BrandValidation.getBrand),
  brandController.getBrand
);

module.exports = router;
