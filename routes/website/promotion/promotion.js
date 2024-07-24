var express = require("express");
var router = express.Router();
var promotionController = require("../../../controller/admin/promotion/promotionController");

router.get("/promotion",promotionController.getListPromotion);
module.exports = router;