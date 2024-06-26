const express = require("express");
const router = express.Router();
const authRouter = require("./auth/auth");
const homeRouter = require("./revenue/revenue");
const productRouter = require("./products/products");


router.use("/auth", authRouter);
router.use("/home", homeRouter);
router.use("/product", productRouter);

module.exports = router;
