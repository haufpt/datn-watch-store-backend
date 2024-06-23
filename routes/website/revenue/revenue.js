var express = require("express");
var router = express.Router();
var revenueController = require("../../../controller/admin/revenue/revenueStatistics");

router.use("/",  revenueController.listRevenueDashboard);
module.exports = router;
