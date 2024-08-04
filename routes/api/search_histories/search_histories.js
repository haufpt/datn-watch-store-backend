var express = require("express");
var router = express.Router();
const searchHistoriesController = require("../../../controller/search_histories/search_histories");
const { checkLogin, checkPermission } = require("../../../middleware/auth");
const { AccountRoleEnum } = require("../../../common/enum");
const SearchHistoriesValidation = require("../../../validation/search_histories");
const { validateSchema } = require("../../../middleware/validate");

router.get(
  "/",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  validateSchema(SearchHistoriesValidation.getSearchHistories),
  searchHistoriesController.getListSearchHistories
);

module.exports = router;
