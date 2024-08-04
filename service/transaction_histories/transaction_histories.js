const transactionHistoriesModel = require("../../model/transaction_histories");

const createNewTransaction = async (data, session) => {
  try {
    const transactionHistory = new transactionHistoriesModel(data);
    return await transactionHistory.save({ session });
  } catch (error) {
    throw error;
  }
};

const find = async (filter) => {
  return await transactionHistoriesModel.find(filter).sort({ createdAt: -1 });
};

module.exports = {
  createNewTransaction,
  find,
};
