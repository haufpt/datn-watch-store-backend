const { OrderStatusEnum } = require("../../common/enum");
const discountModel = require("../../model/discounts");
const mongoose = require("mongoose");

const getListDiscountByUser = async (accountId) => {
  console.log("[DiscountService] processOrder: ", accountId);
  const currentDate = new Date().toISOString();

  const discounts = await discountModel.aggregate([
    {
      $match: {
        $or: [
          { expirationDate: { $exists: false } },
          { expirationDate: { $gte: currentDate } },
        ],
      },
    },
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "discountId",
        as: "orders",
        pipeline: [
          {
            $match: {
              accountId: new mongoose.Types.ObjectId(accountId),
              status: { $ne: OrderStatusEnum.PROCESSING },
            },
          },
        ],
      },
    },
    {
      $match: {
        orders: { $eq: [] },
      },
    },
    {
      $project: {
        code: 1,
        content: 1,
        createdDate: 1,
        expirationDate: 1,
        discountType: 1,
        discountValue: 1,
      },
    },
  ]);

  return discounts;
};

const findDiscount = async (filter) => {
  return await discountModel.findOne(filter);
};

module.exports = {
  getListDiscountByUser,
  findDiscount,
};
