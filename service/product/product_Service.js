const mongoose = require("mongoose");
const productModel = require("../../model/productsModel.js");

const createNewProduct = async (data) => {
  try {
    const product = new productModel(data);
    console.log("data product:  ", product);
    const createdCycleCourse = await product.save();
    return createdCycleCourse;
  } catch (error) {
    throw error;
  }
};

const getListProduct = async () => {
  const pipeline = [
    {
      $lookup: {
        from: "brands",
        localField: "brandId",
        foreignField: "_id",
        as: "brandInfo",
      },
    },
    {
      $unwind: {
        path: "$brandInfo",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $group: {
        _id: "$_id",
        product: { $first: "$$ROOT" },
        brandInfo: { $first: "$brandInfo" },
      },
    },
  ];
  return await productModel.aggregate(pipeline);
};

const findProductByID = async (idProduct) => {
  console.log("[findProductByID] idProduct:", idProduct);
  try {
    const pipeline = [
      {
        $match: { _id: new mongoose.Types.ObjectId(idProduct) },
      },
      {
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brandInfo",
        },
      },
      {
        $addFields: {
          brandInfo: { $arrayElemAt: ["$brandInfo", 0] },
        },
      },
    ];

    var product = await productModel.aggregate(pipeline);
    if (product.length != 1) {
      return null;
    }
    return product[0];
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createNewProduct,
  getListProduct,
  findProductByID,
};
