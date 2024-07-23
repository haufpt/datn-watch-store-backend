var express = require("express");
var router = express.Router();
var accController = require("../../../controller/admin/user/accountController");

router.use("/list-user",  accController.listUser);
router.use("/detail-user/:idAccount",  accController.detailUser);

module.exports = router;