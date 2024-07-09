const express = require("express");
const { required } = require("joi");
const router = express.Router();
const productRouter = require("../../../controller/admin/products/productController")

router.get("/list-products",productRouter.listProduct);
router.get("/detail-products",productRouter.detailProduct);
router.get("/add-products",productRouter.addProduct);

module.exports = router;
