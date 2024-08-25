const { AccountRoleEnum } = require("../../common/enum");
const accountService = require("../../service/account/account");
const AccountValidation = require("../../validation/account");
const mongoose = require("mongoose");

const createStaff = async (req, res) => {
  try {
    const baseUrl = req.protocol + "://" + req.get("host") + "/";
    const newAccount = req.body;
    if (!newAccount.role) {
      newAccount.role = AccountRoleEnum.STAFF;
    }
    if (!newAccount.password) {
      newAccount.password = "12345@aA";
    }
    console.log("[AcountController] createStaff req: ", newAccount);

    var isExistUserName = await accountService.findAccount({
      userName: newAccount.userName,
    });
    if (isExistUserName) {
      return res.status(301).json({
        success: false,
        message: `User name is exist.`,
      });
    }

    var isExistEmail = await accountService.findAccount({
      email: newAccount.email,
    });
    if (isExistEmail) {
      return res.status(301).json({
        success: false,
        message: `Email is exist.`,
      });
    }

    if (req.file) {
      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(301).json({
          success: false,
          message: `File không phải là hình ảnh.`,
        });
      }

      const photoUrl = baseUrl + req.file.destination + req.file.filename;
      newAccount.avatarUrl = photoUrl;
    } else {
      newAccount.avatarUrl = avatarDefault;
    }

    var isSuccess = await accountService.addAccount(newAccount);
    if (!isSuccess) {
      return res.status(301).json({
        success: false,
        message: `Tạo nhân viên thất bại.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Tạo nhân viên thành công.`,
    });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

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

    console.log("[AccountController] updateProfile req.files: ", req.files);
    console.log("[AccountController] updateProfile req.file: ", req.file);
    if (req.file) {
      console.log("[AccountController] updateProfile req.file");
      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(301).json({
          success: false,
          message: `File không phải là hình ảnh.`,
        });
      }

      const photoUrl = baseUrl + req.file.destination + req.file.filename;
      formData.avatarUrl = photoUrl;
      console.log("[AccountController] updateProfile photoUrl: ", photoUrl);
      console.log("[AccountController] updateProfile formData: ", formData);
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

const updateAccount = async (req, res) => {
  try {
    const baseUrl = req.protocol + "://" + req.get("host") + "/";
    const accountId = req.params.idAccount;
    const formData = {
      userName: req.body.userName,
      email: req.body.email,
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
    };

    console.log("[AccountController] updateAccount formData: ", formData);

    const { error } = AccountValidation.updateAcount.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: error.details.map((detail) => detail.message),
      });
    }

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
      console.log("[AccountController] updateAccount req.file");
      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(301).json({
          success: false,
          message: `File không phải là hình ảnh.`,
        });
      }

      const photoUrl = baseUrl + req.file.destination + req.file.filename;
      formData.avatarUrl = photoUrl;
      console.log("[AccountController] updateAccount photoUrl: ", photoUrl);
      console.log("[AccountController] updateAccount formData: ", formData);
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

const changeStatus = async (req, res) => {
  try {
    let idAccount = req.params.idAccount;
    let status = req.body.status;
    const account = await accountService.findAccountById(idAccount);
    console.log("[acountController] changeStatus -> ", account);

    if (!account) {
      return res.status(301).json({
        success: false,
        message: `Tài khoản không tồn tại.`,
      });
    }

    if (status === null || status === undefined) {
      return res.status(301).json({
        success: false,
        message: "`status` field is required",
      });
    }

    await accountService.findByIdAndUpdate(idAccount, { isDeleted: status });

    res.status(201).json({
      success: true,
      message: status ? "Khoá tài khoản thành công" : `Mở tài khoản thành công`,
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
  changeStatus,
  createStaff,
  updateAccount,
};
