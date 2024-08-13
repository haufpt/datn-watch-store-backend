const discountService = require("../../service/discount/discount");
const mongoose = require("mongoose");

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

const updateDiscount = async (req, res) => {
  try {
    const body = req.body;
    const discountId = req.params.discountId;
    console.log("[DiscountController] updateDiscount body: ", body);
    console.log("[DiscountController] updateDiscount discountId: ", discountId);

    const discount = await discountService.findDiscount({
      _id: new mongoose.Types.ObjectId(discountId),
    });
    console.log("[DiscountController] updateDiscount discount -> ", discount);

    if (!discount) {
      return res.status(301).json({
        success: false,
        message: `Khuyến mãi không tồn tại.`,
      });
    }

    await discountService.findByIdAndUpdate(discountId, body);

    res.status(201).json({
      success: true,
      message: `Cập nhật khuyến mãi thành công.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const deleteDiscount = async (req, res) => {
  try {
    const discountId = req.params.discountId;
    console.log("[DiscountController] deleteDiscount discountId: ", discountId);

    const discount = await discountService.findDiscount({
      _id: new mongoose.Types.ObjectId(discountId),
    });
    console.log("[DiscountController] deleteDiscount discount -> ", discount);

    if (!discount) {
      return res.status(301).json({
        success: false,
        message: `Khuyến mãi không tồn tại.`,
      });
    }

    await discountService.findByIdAndUpdate(discountId, {
      isDeleted: true,
    });

    res.status(201).json({
      success: true,
      message: `Xoá khuyến mãi thành công.`,
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
  updateDiscount,
  deleteDiscount,
};
