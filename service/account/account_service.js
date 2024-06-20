const accountModel = require("../../model/accountModel");

const findAccount = async (filter) => {
  return await accountModel.findOne(filter);
};

const addAccount = async (account) => {
  const newAccount = new accountModel(account);
  return await newAccount.save();
};

const findByIdAndUpdate = async (idAccount, newInfomation) => {
  return await accountModel.findByIdAndUpdate(idAccount, newInfomation);
};

module.exports = {
  findAccount,
  addAccount,
  findByIdAndUpdate,
};
