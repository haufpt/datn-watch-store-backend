const mongoose = require("mongoose");

const statisticalStore = async (req, res) => {
  try {
    res.render("./index.ejs", {
      title: "Thống kê",
      routerName: "statistical",
      info: req.session.statistical,
    });
  } catch (error) {
    F;
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
  statisticalStore,
};
