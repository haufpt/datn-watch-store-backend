const accountModel = require("../../model/account");

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

const findAccountById = async (idAccount) => {
  return await accountModel.findById(idAccount);
};

const getAllAcountUser = async ({ page = 1, limit = 10 } = {}) => {
  try {
    const skip = (page - 1) * limit;
    const accounts = await accountModel.find({ role: 'CLIENT' }).skip(skip).limit(limit);
    const totalAccount = await accountModel.countDocuments({ role: 'CLIENT' });

    return {
      accounts: accounts,
      currentPage: page,
      totalPages: Math.ceil(totalAccount / limit),
      totalAccount,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findAccount,
  addAccount,
  findByIdAndUpdate,
  getAllAcountUser,
  findAccountById
};
