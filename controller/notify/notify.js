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

module.exports = {
  getListNotify,
};
