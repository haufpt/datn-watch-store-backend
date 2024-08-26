const mongoose = require("mongoose");
const notifyService = require("../../../service/notify/notify");

const managerNotify = async (req, res) => {
  try {
    var page = parseInt(req.query.page) || 1;
    var limit = parseInt(req.query.limit) || 15;
    let totalPages;
    var searchQerry = req.query.search;     
    const listNotify = await notifyService.getAllNotify(page, limit, searchQerry);
    const listNotify2 = await notifyService.getAllNotify(page, 1000000000, searchQerry);
    totalPages = Math.ceil(listNotify2.length / limit);
    res.render("./index.ejs", {
      title: "Thông báo",
      routerName: "notify",
      info: req.session.account,
      listNotify: listNotify,
      totalPages: totalPages,
      currentPage : page,
      limit: limit
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
