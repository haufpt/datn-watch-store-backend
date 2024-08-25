const { GetListTypeEnum, AccountRoleEnum } = require("../../common/enum");
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

const getAllAcountUser = async ({ page = 1, limit = 100, type, role } = {}) => {
  try {
    const skip = (page - 1) * limit;
    let query = { role: role ?? AccountRoleEnum.CLIENT };

    if (type) {
      if (type === GetListTypeEnum.ACTIVE) {
        query.$or = [{ isDeleted: { $exists: false } }, { isDeleted: false }];
      } else {
        query.isDeleted = true;
      }
    }

    const accounts = await accountModel.find(query);
    const totalAccount = await accountModel.countDocuments(query);

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
  findAccountById,
};
