const cartItemsModel = require("../../model/cart_item");

const findCart = async (filter) => {
  return await cartItemsModel.findOne(filter);
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
};
