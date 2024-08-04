var express = require("express");
var router = express.Router();
const transactionHistoriesController = require("../../../controller/transaction_histories/transaction_histories");
const { checkLogin, checkPermission } = require("../../../middleware/auth");
const { AccountRoleEnum } = require("../../../common/enum");

router.get(
  "/",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  transactionHistoriesController.getListTransactionHistories
);

module.exports = router;
