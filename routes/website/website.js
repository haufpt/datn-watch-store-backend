const express = require("express");
const router = express.Router();
const authRouter = require("./auth/auth");
const homeRouter = require("./revenue/revenue");
const productRouter = require("./products/products");
const brandRouter = require("./brand/brand");
const orderRouter = require("./order/order");


router.use("/auth", authRouter);
router.use("/home", homeRouter);
router.use("/brand", brandRouter);
router.use("/product", productRouter);
router.use("/order", orderRouter);


module.exports = router;
