const mongoose = require("mongoose");
const productModel = require("../../model/product.js");
const BrandService = require("../../service/brand/brand.js");

const createNewProduct = async (data) => {
  try {
    const product = new productModel(data);
    console.log("[ProductService] createNewProduct:  ", product);

    const existBrand = await BrandService.findBrandById(product.brandId);
    if (!existBrand) {
      throw new Error("Brand không tồn tại.");
    }

    const existProduct = await getProducts({ name: product.name });
    if (existProduct.length !== 0) {
      throw new Error("Tên sản phẩm đã tồn tại.");
    }

    return await product.save();
  } catch (error) {
    throw error;
  }
};

const getProducts = async (filter) => {
  return await productModel.find(filter);
};

const getListProduct = async () => {
  const pipeline = [
    {
      $lookup: {
        from: "brands",
        localField: "brandId",
        foreignField: "_id",
        as: "brand",
      },
    },
    {
      $unwind: {
        path: "$brand",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        _id: 1,
        description: 1,
        name: 1,
        price: 1,
        quantity: 1,
        photoUrls: 1,
        createdDate: 1,
        size: 1,
        machineCategory: 1,
        wireCategory: 1,
        brand: 1,
      },
    },
  ];
  return await productModel.aggregate(pipeline);
};

const findProductByID = async (idProduct) => {
  console.log("[ProductService] findProductByID: ", idProduct);
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
          as: "brand",
        },
      },
      {
        $addFields: {
          brand: { $arrayElemAt: ["$brand", 0] },
        },
      },
      {
        $project: {
          _id: 1,
          description: 1,
          name: 1,
          price: 1,
          quantity: 1,
          photoUrls: 1,
          createdDate: 1,
          size: 1,
          machineCategory: 1,
          wireCategory: 1,
          brand: 1,
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
