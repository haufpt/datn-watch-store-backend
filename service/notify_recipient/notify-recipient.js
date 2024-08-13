const notificationRecipientsModel = require("../../model/notification_recipients");
const mongoose = require("mongoose");

const createNotifyRecipient = async (data) => {
  const notificationData = new notificationRecipientsModel(data);
  return await notificationData.save();
};

module.exports = {
  createNotifyRecipient,
};
