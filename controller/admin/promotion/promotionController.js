const orderService = require("../../../service/discount/discount");

const getListPromotion = async (req, res) => {
  try {
    const listPromotion = await orderService.getListDiscount();
    console.log(
      `[promotionController] getListPromotion: ListPromotion -> ${JSON.stringify(listPromotion)}`
    );

    res.render("./index.ejs", {
      title: "Danh sách khách hàng",
      routerName: "promotion",
      info: req.session.promotion,
      promotionData: listPromotion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
  getListPromotion,
};
