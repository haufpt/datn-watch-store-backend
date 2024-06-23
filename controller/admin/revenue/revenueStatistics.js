const mongoose = require("mongoose");


const listRevenueStatistics = async (req, res) => {
  try {
    res.render("./admin/index.ejs", {
      title: "Thống kê",
      routerName: "revenue",
      info: req.session.userLogin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const listRevenueDashboard = async (req, res) => {
  try {
    res.render("./index.ejs", {
      title: "Dashboard",
      routerName: "dashboard",
      info: req.session.userLogin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
  listRevenueStatistics,
  listRevenueDashboard,
};
