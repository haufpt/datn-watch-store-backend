const discountService = require("../../../service/discount/discount");
const DiscountValidation = require("../../../validation/discount");

const getListPromotion = async (req, res) => {
  try {
    var page = parseInt(req.query.page) || 1;
    var limit = parseInt(req.query.limit) || 15;
    let totalPages;
    var searchQerry = req.query.search;
    const listPromotion = await discountService.getListDiscount(page, limit, searchQerry);
    const listPromotion2 = await discountService.getListDiscount(page, 10000000000, searchQerry);
    console.log(
      `[promotionController] getListPromotion: ListPromotion -> ${JSON.stringify(listPromotion)}`
    );
    totalPages = Math.ceil(listPromotion2.length / limit);

    res.render("./index.ejs", {
      title: "Danh sách khách hàng",
      routerName: "promotion",
      info: req.session.account,
      promotionData: listPromotion,
      totalPages: totalPages,
      currentPage : page,
      limit: limit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const postDiscount = async (req, res) => {
  try {
    const { content,discountType, discountValue, createdDate, expirationDate } = req.body;
    console.log(`[discountController][postDiscount] formData 1 -> ${JSON.stringify(req.body)}`);
    const { error } = DiscountValidation.addDiscount.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: error.details.map((detail) => detail.message),
      });
    }
    const existingCodes = await discountService.getAllDiscountCodes();
    const formData = {
      content: content,
      discountType: discountType,
      discountValue: discountValue,
      createdDate: createdDate,
      expirationDate: expirationDate
    };
    formData.code = discountService.generateUniqueCode(9, existingCodes);
    console.log(`[discountController][postDiscount] formData -> ${JSON.stringify(formData)}`);

    await discountService.createNewDiscount(formData);

    res.status(201).json({
      success: true,
      message: `Tạo mã giảm giá thành công.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
  getListPromotion,
  postDiscount
};
