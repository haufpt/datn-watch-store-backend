const express = require("express");
const { required } = require("joi");
const router = express.Router();
const brandRouter = require("../../../controller/admin/brands/brandController")

router.get("/list-brands", brandRouter.listBrand);

module.exports = router;
