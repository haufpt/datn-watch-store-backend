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

const getListDiscount = async () => {
  try {
    const pipeline = [
      {
        $match: {
          isDelete: { $ne: false },
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          createdDate: 1,
          discountType: 1,
          discountValue: 1,
          expirationDate: 1,
          code: 1,
        },
      },
    ];

    return await discountModel.aggregate(pipeline);
  } catch (error) {
    console.error(error);
  }
};

const createNewDiscount = async (data) => {
  try {
    const discountData = new discountModel(data);
    return await discountData.save();
  } catch (error) {
    throw error;
  }
};

function generateUniqueCode(length, existingCodes) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  let isUnique = false;

  while (!isUnique) {
    result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    isUnique = !existingCodes.includes(result);
  }

  return result;
}

const getAllDiscountCodes = async () => {
  try {
    const pipeline = [
      {
        $match: {
          isDelete: { $ne: false },
        },
      },
      {
        $project: {
          _id: 1,
          code: 1,
        },
      },
    ];

    const discounts = await discountModel.aggregate(pipeline);
    console.log(`[discountService] getAllDiscountCodes: listCode -> ${JSON.stringify(discounts)} ` );
    return discounts.map(discount => discount.code);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getListDiscountByUser,
  findDiscount,
  getListDiscount,
  createNewDiscount,
  generateUniqueCode,
  getAllDiscountCodes
};
