const mongoose = require("mongoose");

const managerNotify = async (req, res) => {
  try {
    res.render("./index.ejs", {
      title: "Thông báo",
      routerName: "notify",
      info: req.session.notify,
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
