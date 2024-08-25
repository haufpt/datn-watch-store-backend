const orderModel = require("../../model/order");
const accountModel = require("../../model/account");
const producttemModel = require("../../model/product");
const cartItemsModel = require("../../model/cart_item");
const mongoose = require("mongoose");
const order_item = require("../../model/order_item");

const getListOrder = async (page, limit, searchKeyword) => {
  try {
    
    const matchStage = {
      status: { $ne: "PROCESSING" },
    };

    if (searchKeyword) {
      matchStage.code = { $regex: searchKeyword, $options: 'i' };
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
    return updateOrder;
  } catch (error) {
    throw error;
  }
};

const getTotalRecords = async (searchCode) => {
  try {
    const totalRecords = await orderModel.countDocuments({ status: { $ne: "PROCESSING" }});
    return totalRecords;
  } catch (error) {
    throw new Error(`Error while getting total records: ${error.message}`);
  }
};
const getTotalRecordsByStatus = async (status) => {
  try {
    const totalRecords = await orderModel.countDocuments({ status: status});
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
  getTotalRecordsByStatus
};
