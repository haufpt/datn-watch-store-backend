const express = require("express");
const router = express.Router();
const authRouter = require("./auth/auth");
const homeRouter = require("./revenue/revenue");

router.use("/auth", authRouter);
router.use("/home", homeRouter);

module.exports = router;
