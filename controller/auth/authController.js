const accountService = require("../../service/account/account_service");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { userName, password, firebase } = req.body;
    console.log("[AuthController] login req: ", req.body);

    var isExistUserName = await accountService.findAccount({
      userName: userName,
    });

    if (!isExistUserName) {
      return res.status(301).json({
        success: false,
        message: "Sai tài khoản hoặc mật khẩu.",
      });
    }

    if (password != isExistUserName.password) {
      return res.status(301).json({
        success: false,
        message: "Sai tài khoản hoặc mật khẩu.",
      });
    }

    await accountService.findByIdAndUpdate(isExistUserName._id, {
      firebaseNotifications: [firebase],
    });

    const secretKey = "this-is-my-secret-key";
    const token = jwt.sign(req.body, secretKey);

    res.status(200).json({
      success: true,
      data: {
        information: isExistUserName,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const singup = async (req, res) => {
  try {
    const newAccount = req.body;
    console.log("[AuthController] singup req: ", newAccount);

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

    var isSuccess = await accountService.addAccount(newAccount);
    if (!isSuccess) {
      return res.status(301).json({
        success: false,
        message: `Tạo tài khoản thất bại.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Đăng ký thành công.`,
    });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, { firebaseNotifications: [] });

    res.status(200).json({ message: "Đã đăng xuất thành công" });
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi đăng xuất" });
  }
};

module.exports = {
  login,
  singup,
  logout,
};
