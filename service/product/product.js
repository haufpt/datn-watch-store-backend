const mongoose = require("mongoose");
const productModel = require("../../model/product.js");
const reviewModel = require("../../model/review.js");
const BrandService = require("../../service/brand/brand.js");
const CartService = require("../../service/cart/cart.js");
const OrderService = require("../../service/order/order.js");
const SearchHistoriesService = require("../../service/search_histories/search_histories.js");
const {
  TopProductTypeEnum,
  UpdateCartTypeEnum,
} = require("../../common/enum.js");
const account = require("../../model/account.js");

const createNewProduct = async (data) => {
  try {
    const product = new productModel(data);
    const existBrand = await BrandService.findBrandById(product.brandId);
    if (!existBrand) {
      throw new Error("Brand không tồn tại.");
    }
    console.log("[ProductService] createNewProduct:  ", product);
    const existProduct = await getProducts(product.name);
    if (existProduct.length !== 0) {
      throw new Error("Tên sản phẩm đã tồn tại.");
    }

    return await product.save();
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (idProduct, updatedData) => {
  try {
    const product = await productModel.findById(idProduct);
    if (!product) throw new Error("Product not found");

    const existBrand = await BrandService.findBrandById(updatedData.brandId);
    if (!existBrand) throw new Error("Brand does not exist");

    const existingProduct = await productModel.findOne({
      name: updatedData.name,
      _id: { $ne: new mongoose.Types.ObjectId(idProduct) },
    });
    if (existingProduct) throw new Error("Product name already exists");

    if (!updatedData.photoUrls || updatedData.photoUrls.length === 0) {
      updatedData.photoUrls = product.photoUrls;
    }

    return await productModel.findByIdAndUpdate(idProduct, updatedData);
  } catch (error) {
    throw error;
  }
};

const getListProduct = async ({
  type,
  page = 1,
  limit = 15,
  brandId,
  textSearch,
  accountId,
} = {}) => {
  let pipeline = [];

  if (brandId) {
    const objectIdBrandId = new mongoose.Types.ObjectId(brandId);
    pipeline.push({
      $match: {
        brandId: objectIdBrandId,
      },
    });
  }

  if (textSearch) {
    if (accountId) {
      const existedTextSearch = await SearchHistoriesService.findOne({
        accountId: accountId,
        textSearch: textSearch,
      });

      if (!existedTextSearch) {
        await SearchHistoriesService.createNewSearchHistory({
          accountId: accountId,
          textSearch: textSearch,
          createdAt: new Date(),
        });
      }
    }

    pipeline.push({
      $match: {
        name: { $regex: textSearch, $options: "i" },
      },
    });
  }

  pipeline = [
    ...pipeline,
    {
      $match: {
        isDeleted: { $ne: true },
      },
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
        $unwind: {
          path: "$brand",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "productId",
          as: "reviews",
          pipeline: [
            {
              $lookup: {
                from: "accounts",
                localField: "accountId",
                foreignField: "_id",
                as: "account",
              },
            },
            {
              $unwind: {
                path: "$account",
                preserveNullAndEmptyArrays: false,
              },
            },
          ],
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
          reviews: 1,
          numberPurchase: { $size: "$order_items" },
          totalSold: {
            $sum: "$order_items.quantity",
          },
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

const getProducts = async (name) => {
  try {
    const products = await productModel.find({ name: name });
    return products;
  } catch (error) {
    throw error;
  }
};

const addProductToCart = async (body) => {
  try {
    let existCart = await CartService.findCart({
      accountId: new mongoose.Types.ObjectId(body.accountId),
      productId: new mongoose.Types.ObjectId(body.productId),
    });

    if (existCart) {
      existCart.quantity =
        body.type === UpdateCartTypeEnum.PLUS
          ? existCart.quantity + body.quantity
          : existCart.quantity - body.quantity;

      if (existCart.quantity <= 0) {
        return CartService.deleteCartById(existCart._id);
      }
      return CartService.findByIdAndUpdate(existCart._id, existCart);
    }

    return await CartService.addCart(body);
  } catch (error) {
    throw error;
  }
};

const postLockProduct = async (idProduct) => {
  try {
    const lockProduct = await productModel.findByIdAndUpdate(
      idProduct,
      { isDeleted: true },
      { new: true }
    );
    console.log(`[productService] postLockProduct: newData -> ${lockProduct}`);
    return lockProduct;
  } catch (error) {
    throw error;
  }
};

const evaluateProduct = async (body) => {
  try {
    const product = await productModel.findById(body.productId);
    if (!product) throw new Error("Sẩn phẩm không tồn tại");

    const order = await OrderService.findOrder({ _id: body.orderId });
    if (!order) throw new Error("Đơn hàng không tồn tại");

    const review = new reviewModel(body);

    return await review.save();
  } catch (error) {
    throw error;
  }
};

const getTotalRecords = async () => {
  try {
    var limit = 15;
    const totalRecords = await productModel.countDocuments({ isDeleted: { $ne: true }});
    console.log(`[produtService] total -> ${totalRecords}`);
    const total =  Math.ceil(totalRecords / limit);
    return total;
  } catch (error) {
    throw new Error(`Error while getting total records: ${error.message}`);
  }
};

module.exports = {
  createNewProduct,
  getListProduct,
  findProductByID,
  updateProduct,
  addProductToCart,
  postLockProduct,
  evaluateProduct,
  getTotalRecords
};
