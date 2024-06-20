const express = require("express");
const router = express.Router();
const authController = require("../../controller/auth/authController");
const { validateSchema } = require("../../middleware/validate");
const checkPermission = require("../../middleware/permission");
const AuthValidation = require("../../validation/auth");

router.post(
  "/register",
  validateSchema(AuthValidation.signup),
  authController.singup
);

router.post(
  "/login",
  validateSchema(AuthValidation.login),
  authController.login
);

router.post(
  "/logout",
  checkPermission.checkRole(["ADMIN", "CLIENT"]),
  authController.logout
);

module.exports = router;
