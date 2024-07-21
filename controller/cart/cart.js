const cartService = require("../../service/cart/cart");

const getListCart = async (req, res) => {
  try {
    const listCart = await cartService.getListCart(req.session.account.id);

    res.status(201).json({
      success: true,
      message: `Lấy danh sách giỏ hàng thành công.`,
      data: { carts: listCart },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
  getListCart,
};
