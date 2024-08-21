const { NotificationTypeEnum } = require("../../common/enum");
const notificationRecipientsModel = require("../../model/notification_recipients");
const notificationsModel = require("../../model/notifications");
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
      $sort: { "notify.createdAt": -1 },
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
  ]);

  return notifications;
};

const getAllNotify = async () => {
  const notifications = await notificationsModel.aggregate([
    {
      $match: {
        isDeleted: { $ne: true },
        type: { $ne: NotificationTypeEnum.PERSONAL },
      },
    },
    {
      $project: {
        title: 1,
        message: 1,
        createdAt: 1,
        type: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return notifications;
};

const markAllNotificationsAsRead = async (accountId) => {
  await notificationRecipientsModel.updateMany(
    { accountId: new mongoose.Types.ObjectId(accountId) },
    { $set: { isRead: true } }
  );
};

const readNotify = async (accountId, notifyId) => {
  const existedNotificationRecipient =
    await notificationRecipientsModel.findOne({
      accountId: new mongoose.Types.ObjectId(accountId),
      notificationId: new mongoose.Types.ObjectId(notifyId),
    });

  if (!existedNotificationRecipient) {
    throw new Error("Thông báo không tồn tại.");
  }

  const newInfomation = { isRead: true };

  return await notificationRecipientsModel.findByIdAndUpdate(
    existedNotificationRecipient._id,
    newInfomation
  );
};

const createNotify = async (data) => {
  const notificationData = new notificationsModel(data);
  return await notificationData.save();
};

const findByIdAndUpdate = async (notifyId, newInfomation) => {
  return await notificationsModel.findByIdAndUpdate(notifyId, newInfomation);
};

module.exports = {
  getListNotify,
  markAllNotificationsAsRead,
  readNotify,
  createNotify,
  getAllNotify,
  findByIdAndUpdate,
};
