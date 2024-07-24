var express = require("express");
var router = express.Router();
var promotionController = require("../../../controller/admin/promotion/promotionController");

router.get("/promotion",promotionController.promotion);
module.exports = router;