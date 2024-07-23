const discountService = require("../../service/discount/discount");

const getListDiscountByUser = async (req, res) => {
  try {
    const discounts = await discountService.getListDiscountByUser(
      req.session.account.id
    );

    res.status(201).json({
      success: true,
      message: `Lấy danh sách khuyến mãi thành công.`,
      data: {
        discounts: discounts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
  getListDiscountByUser,
};
