const searchHistoriesService = require("../../service/search_histories/search_histories");

const getListSearchHistories = async (req, res) => {
  try {
    const { page, limit } = req.query;
    console.log(
      "[SearchHistoriesController] getListSearchHistories req.query: ",
      req.query
    );

    const listSearchHistories = await searchHistoriesService.find({
      page,
      limit,
      accountId: req.session.account.id,
    });

    res.status(201).json({
      success: true,
      message: `Lấy danh sách tìm kiếm thành công.`,
      data: { searchHistories: listSearchHistories },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
  getListSearchHistories,
};
