const listOrder = async (req, res) => {
  try {
    res.render("./index.ejs", {
      title: "Danh sach don hang",
      routerName: "list-order",
      info: req.session.account,
      listOrderData: listOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
  listOrder,
};
