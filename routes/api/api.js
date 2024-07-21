const express = require("express");
const router = express.Router();
const authRouter = require("./auth/auth");
const brandRouter = require("./brand/brand");
const productRouter = require("./product/product");
const cartRouter = require("./cart/cart");
const shippingAddressRouter = require("./shipping_address/shipping_address");

router.use("/auth", authRouter);

router.use("/brand", brandRouter);

router.use("/product", productRouter);

router.use("/cart", cartRouter);

router.use("/shipping-address", shippingAddressRouter);

module.exports = router;
