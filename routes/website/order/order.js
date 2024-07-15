var express = require("express");
var router = express.Router();
var orderController = require("../../../controller/admin/order/orderController");

router.use("/",  orderController.listOrder);
module.exports = router;