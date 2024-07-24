const promotion = async (req, res) => {
  try {
    res.render("./index.ejs", {
      title: "Danh sách khách hàng",
      routerName: "promotion",
      info: req.session.promotion,
      promotionData: promotion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
    promotion,
};
