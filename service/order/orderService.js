const orderModel = require("../../model/order");
const accountModel = require("../../model/account");
const productModel = require("../../model/product");
const cartItemsModel = require("../../model/cart_item");
const mongoose = require("mongoose");
const orderItemModel = require("../../model/order_item");
const { OrderStatusEnum } = require("../../common/enum");

const getListOrder = async (page, limit, searchCode) => {
  try {
    const matchStage = {
      status: { $ne: "PROCESSING" },
    };

    if (searchCode) {
      matchStage.code = { $regex: searchCode, $options: "i" };
    }

    const pipeline = [
      {
        $match: matchStage,
      },
      {
        $sort: {
          orderDate: -1,
        },
      },
      {
        $lookup: {
          from: "shipping_addresses",
          localField: "shippingAddressId",
          foreignField: "_id",
          as: "shippingAddresses",
        },
      },
      {
        $addFields: {
          shippingAddress: { $arrayElemAt: ["$shippingAddresses", 0] },
        },
      },
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
      {
        $lookup: {
          from: "discounts",
          localField: "discountId",
          foreignField: "_id",
          as: "discounts",
        },
      },
      {
        $addFields: {
          discount: {
            $cond: [
              { $gt: [{ $size: "$discounts" }, 0] },
              { $arrayElemAt: ["$discounts", 0] },
              null,
            ],
          },
        },
      },
      {
        $lookup: {
          from: "order_items",
          localField: "_id",
          foreignField: "orderId",
          as: "orderItems",
          pipeline: [
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
                quantity: 1,
                product: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          code: 1,
          orderDate: 1,
          paymentMethod: 1,
          status: 1,
          shippingAddress: 1,
          discount: 1,
          totalAmount: 1,
          discountAmount: 1,
          orderItems: 1,
          estDeliveryDate: 1,
          account: 1,
          cancelReason: 1,
          cancelDate: 1,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ];

    return await orderModel.aggregate(pipeline);
  } catch (error) {
    console.error(error);
  }
};

const getListOrderByStatus = async (status, page, limit, searchCode) => {
  const matchStage = {
    status: status,
  };

  if (searchCode) {
    matchStage.code = searchCode;
  }

  const pipeline = [
    {
      $match: matchStage,
    },
    {
      $sort: {
        orderDate: -1,
      },
    },
    {
      $lookup: {
        from: "shipping_addresses",
        localField: "shippingAddressId",
        foreignField: "_id",
        as: "shippingAddresses",
      },
    },
    {
      $addFields: {
        shippingAddress: { $arrayElemAt: ["$shippingAddresses", 0] },
      },
    },
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
    {
      $lookup: {
        from: "discounts",
        localField: "discountId",
        foreignField: "_id",
        as: "discounts",
      },
    },
    {
      $addFields: {
        discount: {
          $cond: [
            { $gt: [{ $size: "$discounts" }, 0] },
            { $arrayElemAt: ["$discounts", 0] },
            null,
          ],
        },
      },
    },
    {
      $lookup: {
        from: "order_items",
        localField: "_id",
        foreignField: "orderId",
        as: "orderItems",
        pipeline: [
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
              quantity: 1,
              product: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        code: 1,
        orderDate: 1,
        paymentMethod: 1,
        status: 1,
        shippingAddress: 1,
        discount: 1,
        totalAmount: 1,
        discountAmount: 1,
        orderItems: 1,
        estDeliveryDate: 1,
        account: 1,
        cancelReason: 1,
        cancelDate: 1,
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
  ];
  return await orderModel.aggregate(pipeline);
};

const getListOrderById = async (orderID) => {
  try {
    console.log(`[orderService] getListOrderById: orderId -> ${orderID}`);
    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(orderID),
        },
      },
      {
        $lookup: {
          from: "accounts",
          localField: "accountId",
          foreignField: "_id",
          as: "accounts",
        },
      },
      {
        $unwind: {
          path: "$accounts",
          preserveNullAndEmptyArrays: false,
        },
      },

      {
        $lookup: {
          from: "order_items",
          localField: "_id",
          foreignField: "orderId",
          as: "order_items",
          pipeline: [
            {
              $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "products",
              },
            },
            {
              $unwind: {
                path: "$products",
                preserveNullAndEmptyArrays: false,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "shipping_addresses",
          localField: "accounts._id",
          foreignField: "accountId",
          as: "shipping_addresses",
        },
      },
      {
        $unwind: {
          path: "$shipping_addresses",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "discounts",
          localField: "discountId",
          foreignField: "_id",
          as: "discounts",
        },
      },
      {
        $addFields: {
          discount: { $arrayElemAt: ["$discounts", 0] },
        },
      },
      {
        $group: {
          _id: "$_id",
          orders: { $first: "$$ROOT" },
        },
      },
    ];

    const orderData = await orderModel.aggregate(pipeline);
    console.log(`[orderService] getListOrderById: data -> ${orderData}`);
    if (orderData.length != 1) {
      return null;
    }
    return orderData[0];
  } catch (error) {
    console.error(error);
  }
};

const isUpdateOrder = async (orderId, status) => {
  try {
    console.log(`[orderService] isUpdateOrder: orderId -> ${orderId}`);

    const updateOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    );
    console.log(`[orderService] isUpdateOrder: updateOrder -> ${updateOrder}`);

    if (status === OrderStatusEnum.SHIPPING) {
      const listOrderItem = await orderItemModel.find({
        orderId: new mongoose.Types.ObjectId(orderId),
      });
      console.log(`[orderService] listOrderItem -> ${listOrderItem}`);

      for (let i = 0; i < listOrderItem.length; i++) {
        const product = await productModel.findById(listOrderItem[i].productId);
        console.log(`[orderService] product -> ${product}`);
        if (product) {
          const newQuantity = product.quantity - listOrderItem[i].quantity;
          product.quantity = newQuantity > 0 ? newQuantity : 0;
          await product.save();
        }
      }
    }

    return updateOrder;
  } catch (error) {
    throw error;
  }
};

const getTotalRecords = async (page, searchCode) => {
  try {
    let totalRecords = 0;
    if (searchCode) {
      const sum = await getListOrder(page, 100000000, searchCode);
      totalRecords = Math.ceil(sum.length / 15);
    } else {
      totalRecords = await orderModel.countDocuments({
        status: { $ne: "PROCESSING" },
      });
    }

    return totalRecords;
  } catch (error) {
    throw new Error(`Error while getting total records: ${error.message}`);
  }
};
const getTotalRecordsByStatus = async (status, page, searchCode) => {
  try {
    let totalRecords = 0;
    if (searchCode) {
      const sum = await getListOrder(page, 100000000, searchCode);
      totalRecords = Math.ceil(sum.length / 15);
    } else {
      totalRecords = await orderModel.countDocuments({ status: status });
    }

    return totalRecords;
  } catch (error) {
    throw new Error(`Error while getting total records: ${error.message}`);
  }
};

module.exports = {
  getListOrder,
  getListOrderByStatus,
  getListOrderById,
  isUpdateOrder,
  getTotalRecords,
  getTotalRecordsByStatus,
};
