const notifyService = require("../../service/notify/notify");
const notifyRecipientService = require("../../service/notify_recipient/notify-recipient");
const accountService = require("../../service/account/account");
const { GetListTypeEnum } = require("../../common/enum");

const getListNotify = async (req, res) => {
  try {
    const accountId = req.session.account.id.toString();

    const listNotify = await notifyService.getListNotify(accountId);

    res.status(201).json({
      success: true,
      message: `Lấy danh sách thông báo thành công.`,
      data: {
        notifies: listNotify,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const readNotify = async (req, res) => {
  try {
    const accountId = req.session.account.id.toString();
    const notifyId = req.params.notifyId;
    console.log("[NotifyController] readNotify notifyId: ", notifyId);

    await notifyService.readNotify(accountId, notifyId);

    const listNotify = await notifyService.getListNotify(accountId);

    res.status(201).json({
      success: true,
      message: `Đã đọc các thông báo.`,
      data: {
        quantityNotifyUnread: listNotify.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const createNotify = async (req, res) => {
  try {
    const body = req.body;
    console.log("[NotifyController] createNotify body: ", body);

    body.createdAt = new Date();

    const newNotify = await notifyService.createNotify(body);

    const listUser = await accountService.getAllAcountUser({
      type: GetListTypeEnum.ACTIVE,
    });

    for (let i = 0; i < listUser.accounts.length; i++) {
      await notifyRecipientService.createNotifyRecipient({
        accountId: listUser.accounts[i]._id,
        notificationId: newNotify._id,
        isRead: false,
      });
    }

    res.status(201).json({
      success: true,
      message: `Tạo mới thành công.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const updateNotify = async (req, res) => {
  try {
    const body = req.body;
    const notifyId = req.params.notifyId;
    console.log("[NotifyController] updateNotify body: ", body);
    console.log("[NotifyController] updateNotify notifyId: ", notifyId);

    await notifyService.findByIdAndUpdate(notifyId, body);

    res.status(201).json({
      success: true,
      message: `Cập nhật thành công.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const deleteNotify = async (req, res) => {
  try {
    const notifyId = req.params.notifyId;
    console.log("[NotifyController] deleteNotify notifyId: ", notifyId);

    await notifyService.findByIdAndUpdate(notifyId, { isDeleted: true });

    res.status(201).json({
      success: true,
      message: `Xoá thành công.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
  getListNotify,
  readNotify,
  createNotify,
  updateNotify,
  deleteNotify,
};
