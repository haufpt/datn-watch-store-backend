const orderModel = require("../../model/order");
const accountModel = require("../../model/account");
const producttemModel = require("../../model/product");
const cartItemsModel = require("../../model/cart_item");
const mongoose = require("mongoose");
const order_item = require("../../model/order_item");

const getListOrder = async () => {
  try {
    const pipeline = [
      {
        $match: {
          status: { $ne: "PROCESSING" }
        }
      },
      {
        $project: {
          _id: 1,
          code: 1,
          orderDate: 1,
          paymentMethod: 1,
          status: 1,
        },
      },
    ];

    return await orderModel.aggregate(pipeline);
  } catch (error) {
    console.error(error);
  }
};

const getListOrderByStatus = async (status) => {
  const pipeline = [
    {
      $match: {
        status: status,
      },
    },
    {
      $project: {
        _id: 1,
        code: 1,
        orderDate: 1,
        paymentMethod: 1,
        status: 1,
      },
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
          as: "accounts"
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

const  isUpdateOrder = async (orderId, status) => {
  try {
    console.log(`[orderService] isUpdateOrder: orderId -> ${orderId}`);

    const updateOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    );
    console.log(`[orderService] isUpdateOrder: updateOrder -> ${updateOrder}`);
    return updateOrder;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getListOrder,
  getListOrderByStatus,
  getListOrderById,
  isUpdateOrder
};
