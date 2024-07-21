var express = require("express");
var router = express.Router();
var orderController = require("../../../controller/admin/order/orderController");

router.use("/list-order",  orderController.listOrder);
router.use("/detail-order",  orderController.detailOrder);
module.exports = router;