const express = require("express");
const { required } = require("joi");
const router = express.Router();
const productRouter = require("../../../controller/admin/products/productController");
const { checkRole} = require("../../../middleware/auth");
const { AccountRoleEnum, FileTypeEnum } = require("../../../common/enum");
const multerService = require("../../../shared/multer");
const checkFile = require("../../../middleware/file");

router.get(
  "/list-products",
  checkRole([AccountRoleEnum.ADMIN, AccountRoleEnum.STAFF]),
  productRouter.listProduct
);

router.get(
  "/detail-products/:idProduct",
  checkRole([AccountRoleEnum.ADMIN, AccountRoleEnum.STAFF]),
  productRouter.detailProduct
);

router.get(
  "/add-products",
  checkRole([AccountRoleEnum.ADMIN, AccountRoleEnum.STAFF]),
  productRouter.addProduct
);

router.post(
  "/post-product",
  checkRole([AccountRoleEnum.ADMIN, AccountRoleEnum.STAFF]),
  multerService.uploadFile(FileTypeEnum.IMAGE).array("photoUrls"),
  checkFile("MULTIPLE"),
  productRouter.postProduct
);

router.post(
  "/lock-product/:idProduct",
  productRouter.lockProduct
);

router.put(
  "/update-product/:idProduct",
  checkRole([AccountRoleEnum.ADMIN, AccountRoleEnum.STAFF]),
  multerService.uploadFile(FileTypeEnum.IMAGE).array("photoUrls"),
  productRouter.updateProduct
);
module.exports = router;
