const express = require("express");
const router = express.Router();
const authRouter = require("./auth/auth");
const homeRouter = require("./revenue/revenue");
const productRouter = require("./products/products");
const brandRouter = require("./brand/brand");
const orderRouter = require("./order/order");
const userRouter = require("./account/user");
const promotionRouter = require("./promotion/promotion");
const statisticalRouter = require("./statistical/statistical");
const notifyRouter = require("./notify/notify");

router.use("/auth", authRouter);
router.use("/home", homeRouter);
router.use("/brand", brandRouter);
router.use("/product", productRouter);
router.use("/order", orderRouter);
router.use("/account", userRouter);
router.use("/promotion", promotionRouter);
router.use("/statistical", statisticalRouter);
router.use("/notify", notifyRouter);

module.exports = router;
