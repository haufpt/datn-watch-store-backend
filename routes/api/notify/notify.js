var express = require("express");
var router = express.Router();
const notifyController = require("../../../controller/notify/notify");
const { checkLogin, checkPermission } = require("../../../middleware/auth");
const { AccountRoleEnum } = require("../../../common/enum");
const { validateSchema } = require("../../../middleware/validate");
const NotifyValidation = require("../../../validation/notify");

router.get(
  "/",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  notifyController.getListNotify
);

router.put(
  "/:notifyId",
  checkLogin,
  checkPermission([AccountRoleEnum.CLIENT]),
  validateSchema(NotifyValidation.readNotify),
  notifyController.readNotify
);

router.post(
  "/",
  validateSchema(NotifyValidation.createNotify),
  notifyController.createNotify
);

router.put(
  "/:notifyId/update",
  validateSchema(NotifyValidation.updateNotify),
  notifyController.updateNotify
);

router.delete("/:notifyId", notifyController.deleteNotify);

module.exports = router;
