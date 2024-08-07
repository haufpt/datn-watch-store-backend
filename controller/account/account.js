const accountService = require("../../service/account/account");
const AccountValidation = require("../../validation/account");
const mongoose = require("mongoose");

const updateProfile = async (req, res) => {
  try {
    const baseUrl = req.protocol + "://" + req.get("host") + "/";
    const formData = {
      userName: req.body.userName,
      email: req.body.email,
    };

    console.log("[AccountController] updateProfile formData: ", formData);

    const { error } = AccountValidation.updateProfile.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: error.details.map((detail) => detail.message),
      });
    }

    const accountId = req.session.account.id.toString();

    if (formData.userName) {
      var isExistUsername = await accountService.findAccount({
        userName: formData.userName,
      });

      if (isExistUsername && isExistUsername._id.toString() !== accountId) {
        return res.status(301).json({
          success: false,
          message: `Username đã tồn tại.`,
        });
      }
    }

    if (formData.email) {
      var isExistEmail = await accountService.findAccount({
        email: formData.email,
      });

      if (isExistEmail && isExistEmail._id.toString() !== accountId) {
        return res.status(301).json({
          success: false,
          message: `Email đã tồn tại.`,
        });
      }
    }

    if (req.file) {
      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(301).json({
          success: false,
          message: `File không phải là hình ảnh.`,
        });
      }

      const photoUrl = baseUrl + req.file.destination + req.file.filename;
      formData.avatarUrl = photoUrl;
    }

    await accountService.findByIdAndUpdate(
      new mongoose.Types.ObjectId(accountId),
      formData
    );

    const newAccount = await accountService.findAccount(
      new mongoose.Types.ObjectId(accountId)
    );

    res.status(201).json({
      success: true,
      message: `Cập nhật tài khoản thành công.`,
      data: {
        account: newAccount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    console.log("[AccountController] changePassword body: ", req.body);
    const { oldPassword, newPassword } = req.body;

    const accountId = req.session.account.id;
    var existAccount = await accountService.findAccount({
      _id: accountId,
    });

    if (existAccount.password !== oldPassword) {
      return res.status(301).json({
        success: false,
        message: `Sai mật khẩu hiện tại.`,
      });
    }

    await accountService.findByIdAndUpdate(accountId, {
      password: newPassword,
    });

    const newAccount = await accountService.findAccount(accountId);

    res.status(201).json({
      success: true,
      message: `Đổi mật khẩu thành công.`,
      data: {
        account: newAccount,
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
  updateProfile,
  changePassword,
};
