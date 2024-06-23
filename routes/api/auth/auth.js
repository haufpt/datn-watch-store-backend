const express = require("express");
const router = express.Router();
const authController = require("../../../controller/auth/auth");
const { validateSchema } = require("../../../middleware/validate");
const AuthValidation = require("../../../validation/auth");
const { AccountRoleEnum } = require("../../../common/enum");
const { checkLogin, checkPermission } = require("../../../middleware/auth");

router.get("/login", (req, res) => {
  res.render("./login/login.ejs");
});

router.post(
  "/register",
  validateSchema(AuthValidation.signup),
  authController.singup
);

router.post(
  "/register-admin",
  validateSchema(AuthValidation.signupAdmin),
  authController.singup
);

router.post(
  "/login",
  validateSchema(AuthValidation.login),
  authController.login
);

router.post(
  "/logout",
  checkLogin,
  checkPermission([AccountRoleEnum.ADMIN, AccountRoleEnum.CLIENT]),
  validateSchema(AuthValidation.logout),
  authController.logout
);

module.exports = router;
