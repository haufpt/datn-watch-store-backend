const mongoose = require("mongoose");
const notifyService = require("../../../service/notify/notify");

const managerNotify = async (req, res) => {
  try {
    const listNotify = await notifyService.getAllNotify();

    res.render("./index.ejs", {
      title: "Thông báo",
      routerName: "notify",
      info: req.session.notify,
      listNotify: listNotify,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
  managerNotify,
};
