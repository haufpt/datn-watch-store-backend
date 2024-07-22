const shippingAddressesModel = require("../../model/shipping_addresses");
const mongoose = require("mongoose");

const getListShippingAddress = async (accountId) => {
  console.log("[ShippingAddressesService] getListShippingAddress: ", accountId);
  const pipeline = [
    {
      $match: { accountId: new mongoose.Types.ObjectId(accountId) },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        receiver: 1,
        address: 1,
        phoneNumber: 1,
        isDefault: 1,
      },
    },
  ];

  return await shippingAddressesModel.aggregate(pipeline);
};

const createNewShippingAddress = async (body) => {
  const newShippingAddress = new shippingAddressesModel(body);
  return await newShippingAddress.save();
};

const findShippingAddressById = async (shippingAddressId) => {
  return await shippingAddressesModel.findById(shippingAddressId);
};

const findShippingAddress = async (filter) => {
  return await shippingAddressesModel.find(filter);
};

const updateShippingAddressById = async (
  accountId,
  shippingAddressId,
  body
) => {
  const shippingAddress = await findShippingAddressById(shippingAddressId);
  if (!shippingAddress || shippingAddress.accountId !== accountId) {
    throw new Error("Shipping address not found");
  }

  return await shippingAddressesModel.findByIdAndUpdate(
    shippingAddressId,
    body
  );
};

const deleteShippingAddress = async (accountId, shippingAddressId) => {
  const shippingAddress = await findShippingAddressById(shippingAddressId);
  if (!shippingAddress || shippingAddress.accountId !== accountId) {
    throw new Error("Shipping address not found");
  }

  return await shippingAddressesModel.findByIdAndDelete(shippingAddressId);
};

const setShippingAddressDefault = async (accountId, shippingAddressId) => {
  const shippingAddress = await findShippingAddressById(shippingAddressId);
  if (!shippingAddress || shippingAddress.accountId !== accountId) {
    throw new Error("Shipping address not found");
  }

  const listShippingAddress = await findShippingAddress({
    accountId: new mongoose.Types.ObjectId(accountId),
  });

  for (var i = 0; i < listShippingAddress.length; i++) {
    listShippingAddress[i].isDefault =
      listShippingAddress[i]._id === shippingAddressId;
  }

  const bulkOps = listShippingAddress.map((record) => ({
    updateOne: {
      filter: { _id: record._id },
      update: {
        $set: {
          isDefault: record.isDefault,
        },
      },
      upsert: false,
    },
  }));

  return await shippingAddressesModel.bulkWrite(bulkOps);
};

module.exports = {
  getListShippingAddress,
  createNewShippingAddress,
  deleteShippingAddress,
  findShippingAddressById,
  updateShippingAddressById,
  setShippingAddressDefault,
  findShippingAddress,
};
