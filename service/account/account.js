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

const getAllAcountUser = async ({ page, limit, type, role, searchQuery } = {}) => {
  try {
    const skip = (page - 1) * limit;
    let query = { role: role ?? AccountRoleEnum.CLIENT };

    if (searchQuery) {
      query.$or = [
        { username: { $regex: searchQuery, $options: 'i' } }, 
        { email: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    if (type) {
      if (type === GetListTypeEnum.ACTIVE) {
        query.$or = query.$or || [];
        query.$or.push({ isDeleted: { $exists: false } }, { isDeleted: false });
      } else {
        query.isDeleted = true;
      }
    }

    const accounts = await accountModel.find(query).skip(skip).limit(limit);
    const account2 = await accountModel.find(query).skip(skip).limit(10000000000);
    const totalPages = Math.ceil(account2.length / limit);

    return {
      accounts: accounts,
      currentPage: page,
      limit: limit,
      totalPages: totalPages
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
