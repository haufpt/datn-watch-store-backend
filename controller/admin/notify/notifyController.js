const mongoose = require("mongoose");
const notifyService = require("../../../service/notify/notify");

const managerNotify = async (req, res) => {
  try {
    var page = parseInt(req.query.page) || 1;
    var limit = parseInt(req.query.limit) || 15;
    let totalPages;
    var searchQerry = req.query.search;

    const totalRecords = await notifyService.getTotalRecords();
      totalPages = Math.ceil(totalRecords / limit);
    const listNotify = await notifyService.getAllNotify(page, limit, searchQerry);

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
