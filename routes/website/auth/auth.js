const express = require("express");
const router = express.Router();
const { checkLogin, checkPermission } = require("../../../middleware/auth");
const { AccountRoleEnum, FileTypeEnum } = require("../../../common/enum");
const loginController = require("../../../controller/auth/auth");


router.get("/login", (req, res) => {
  res.render("./login/login.ejs");
});

router.post("/login", loginController.loginWeb);

module.exports = router;
