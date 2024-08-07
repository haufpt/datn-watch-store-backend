const notifyService = require("../../service/notify/notify");

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

module.exports = {
  getListNotify,
  readNotify,
};
