const mongoose = require("mongoose");
const productModel = require("../../model/product.js");
const orderItemModel = require("../../model/order_item.js");
const BrandService = require("../../service/brand/brand.js");
const { TopProductTypeEnum } = require("../../common/enum.js");

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

const getListProduct = async ({ type, page = 1, limit = 10 } = {}) => {
  let pipeline = [
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
      $lookup: {
        from: "order_items",
        let: { productId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$productId", "$$productId"] },
            },
          },
          {
            $lookup: {
              from: "orders",
              let: { orderId: "$orderId" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$_id", "$$orderId"] },
                    status: "DELIVERED",
                  },
                },
              ],
              as: "order",
            },
          },
          { $unwind: "$order" },
        ],
        as: "order_items",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        price: 1,
        quantity: 1,
        photoUrls: 1,
        createdDate: 1,
        size: 1,
        machineCategory: 1,
        wireCategory: 1,
        brand: 1,
        numberPurchase: { $size: "$order_items" },
        totalSold: {
          $sum: "$order_items.quantity",
        },
      },
    },
  ];

  switch (type) {
    case TopProductTypeEnum.SALE:
      pipeline.push({ $sort: { totalSold: -1 } });
      break;
    case TopProductTypeEnum.POPULAR:
      pipeline.push({ $sort: { numberPurchase: -1 } });
      break;
    case TopProductTypeEnum.NEW:
      pipeline.push({ $sort: { createdDate: -1 } });
      break;
    case TopProductTypeEnum.COLLECTION:
      pipeline.push({ $sort: { "brand.name": 1 } });
      break;
    case TopProductTypeEnum.PRICE:
      pipeline.push({ $sort: { price: -1 } });
      break;
    default:
      break;
  }

  pipeline = [...pipeline, { $skip: (page - 1) * limit }, { $limit: limit }];

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
