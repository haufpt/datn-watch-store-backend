const transactionHistoriesService = require("../../service/transaction_histories/transaction_histories");

const getListTransactionHistories = async (req, res) => {
  try {
    const listTransactionHistories = await transactionHistoriesService.find({
      accountId: req.session.account.id,
    });

    res.status(201).json({
      success: true,
      message: `Lấy danh sách lịch sử giao dịch thành công.`,
      data: { transactionHistories: listTransactionHistories },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
  getListTransactionHistories,
};
