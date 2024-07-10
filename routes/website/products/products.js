const express = require("express");
const { required } = require("joi");
const router = express.Router();
const productRouter = require("../../../controller/admin/products/productController");
const { checkLogin, checkPermission } = require("../../../middleware/auth");
const { AccountRoleEnum, FileTypeEnum } = require("../../../common/enum");
const ProductValidation = require("../../../validation/product");
const { validateSchema } = require("../../../middleware/validate");
const multerService = require("../../../shared/multer");
const checkFile = require("../../../middleware/file");

router.get("/list-products",
    productRouter.listProduct);

router.get("/detail-products", 
    productRouter.detailProduct);

router.get("/add-products", 
    productRouter.addProduct);

router.post(
  "/add-products",
  validateSchema(ProductValidation.addProduct),
  multerService.uploadFile(FileTypeEnum.IMAGE).array("files"),
  checkFile("MULTIPLE"),
  productRouter.postProduct
);

module.exports = router;
