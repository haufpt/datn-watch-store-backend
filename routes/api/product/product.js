var express = require("express");
var router = express.Router();
const multer = require("multer");
const productController = require("../../controller/product/product_controller");
const { checkLogin, checkPermission } = require("../../middleware/auth");
const { AccountRoleEnum } = require("../../common/enum");
const ProductValidation = require("../../validation/product");
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

router.get(
  "/",
  checkLogin,
  checkPermission([AccountRoleEnum.ADMIN, AccountRoleEnum.CLIENT]),
  productController.listProduct
);

router.get("/get-product-by-id/:idProduct", productController.findProductById);

router.post(
  "/new",
  checkLogin,
  checkPermission([AccountRoleEnum.ADMIN]),
  validateSchema(ProductValidation.addProduct),
  upload.fields([{ name: "photoUrls" }]),
  productController.postProduct
);

module.exports = router;
