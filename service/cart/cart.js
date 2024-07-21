const cartItemsModel = require("../../model/cart_item");
const mongoose = require("mongoose");

const findCart = async (filter) => {
  return await cartItemsModel.findOne(filter);
};

const getListCart = async (accountId) => {
  console.log("[CartService] getListCart: ", accountId);
  try {
    const pipeline = [
      {
        $match: { accountId: new mongoose.Types.ObjectId(accountId) },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: {
          path: "$product",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          _id: 1,
          product: 1,
          quantity: 1,
        },
      },
    ];

    var carts = await cartItemsModel.aggregate(pipeline);
    return carts;
  } catch (error) {
    console.error(error);
  }
};

const findByIdAndUpdate = async (cartId, newInfomation) => {
  return await cartItemsModel.findByIdAndUpdate(cartId, newInfomation);
};

const deleteCartById = async (cartId) => {
  return await cartItemsModel.findByIdAndDelete(cartId);
};

const addCart = async (cartInfo) => {
  const newCart = new cartItemsModel(cartInfo);
  return await newCart.save();
};

module.exports = {
  findCart,
  findByIdAndUpdate,
  addCart,
  deleteCartById,
  getListCart,
};
