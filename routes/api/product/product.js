var express = require("express");
var router = express.Router();
const productController = require("../../../controller/product/product");
const { checkLogin, checkPermission } = require("../../../middleware/auth");
const { AccountRoleEnum, FileTypeEnum } = require("../../../common/enum");
const ProductValidation = require("../../../validation/product");
const { validateSchema } = require("../../../middleware/validate");
const multerService = require("../../../shared/multer");
const checkFile = require("../../../middleware/file");

router.get(
  "/",
  checkLogin,
  checkPermission([AccountRoleEnum.ADMIN, AccountRoleEnum.CLIENT]),
  validateSchema(ProductValidation.getProduct),
  productController.listProduct
);

router.get(
  "/:idProduct",
  checkLogin,
  checkPermission([AccountRoleEnum.ADMIN, AccountRoleEnum.CLIENT]),
  validateSchema(ProductValidation.getDetailProduct),
  productController.findProductById
);

router.post(
  "/new",
  checkLogin,
  checkPermission([AccountRoleEnum.ADMIN]),
  validateSchema(ProductValidation.addProduct),
  multerService.uploadFile(FileTypeEnum.IMAGE).array("files"),
  checkFile("MULTIPLE"),
  productController.postProduct
);

module.exports = router;
