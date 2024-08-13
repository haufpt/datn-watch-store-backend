var express = require("express");
var router = express.Router();
var statisticalController = require("../../../controller/admin/statistical/statisticalController");
const StatisticalValidation = require("../../../validation/statistical");
const { validateSchema } = require("../../../middleware/validate");

router.get(
  "/",
  validateSchema(StatisticalValidation.getStatistical),
  statisticalController.getStatistical
);

module.exports = router;
