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

const detailOrder = async (req, res) => {
  try {
    res.render("./index.ejs", {
      title: "Chi tiet don hang",
      routerName: "detail-order",
      info: req.session.account,
      detailOrderData: detailOrder,
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
  detailOrder
};
