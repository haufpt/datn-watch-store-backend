var express = require("express");
var router = express.Router();
var orderController = require("../../../controller/admin/order/orderController");

router.get("/list-order",orderController.listOrder);
router.get("/detail-order/:orderId", orderController.getDetailOrder);
module.exports = router;
