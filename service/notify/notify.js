const notificationRecipientsModel = require("../../model/notification_recipients");
const mongoose = require("mongoose");

const getListNotify = async (accountId) => {
  const notifications = await notificationRecipientsModel.aggregate([
    {
      $match: {
        accountId: new mongoose.Types.ObjectId(accountId),
      },
    },
    {
      $lookup: {
        from: "notifications",
        localField: "notificationId",
        foreignField: "_id",
        as: "notify",
      },
    },
    {
      $unwind: "$notify",
    },
    {
      $project: {
        notificationId: "$notify._id",
        title: "$notify.title",
        message: "$notify.message",
        createdAt: "$notify.createdAt",
        type: "$notify.type",
        isRead: 1,
      },
    },
    {
      $sort: { "notify.createdAt": -1 },
    },
  ]);

  return notifications;
};

module.exports = {
  getListNotify,
};
