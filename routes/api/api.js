const express = require("express");
const router = express.Router();
const authRouter = require("./auth/auth");
const brandRouter = require("./brand/brand");
const productRouter = require("./product/product");
const cartRouter = require("./cart/cart");
const shippingAddressRouter = require("./shipping_address/shipping_address");
const orderRouter = require("./order/order");
const discountRouter = require("./discount/discount");
const accountRouter = require("./account/account");
const notifyRouter = require("./notify/notify");
const searchHistoriesRouter = require("./search_histories/search_histories");
const transactionHistoriesRouter = require("./transaction_histories/transaction_histories");
const statisticalRouter = require("./statistical/statistical");

router.use("/auth", authRouter);

router.use("/brand", brandRouter);

router.use("/product", productRouter);

router.use("/cart", cartRouter);

router.use("/shipping-address", shippingAddressRouter);

router.use("/order", orderRouter);

router.use("/discount", discountRouter);

router.use("/account", accountRouter);

router.use("/notify", notifyRouter);

router.use("/search-histories", searchHistoriesRouter);

router.use("/transaction-histories", transactionHistoriesRouter);

router.use("/statistical", statisticalRouter);

module.exports = router;
