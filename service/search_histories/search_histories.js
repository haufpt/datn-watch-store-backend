const searchHistoriesModel = require("../../model/search_histories.js");

const createNewSearchHistory = async (data) => {
  try {
    const searchHistory = new searchHistoriesModel(data);
    const savedBrand = await searchHistory.save();
    return savedBrand;
  } catch (error) {
    throw error;
  }
};

const findOne = async (filter) => {
  return await searchHistoriesModel.findOne(filter);
};

const getListSearchHistories = async (page = 1, limit = 5, accountId) => {
  let pipeline = [
    {
      $match: {
        accountId: accountId,
      },
    },
    {
      $project: {
        _id: 1,
        textSearch: 1,
        createdDate: 1,
      },
    },
  ];

  pipeline = [...pipeline, { $skip: (page - 1) * limit }, { $limit: limit }];

  return await searchHistoriesModel.aggregate(pipeline);
};

module.exports = {
  createNewSearchHistory,
  findOne,
  getListSearchHistories,
};
