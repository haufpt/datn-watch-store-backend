const bcrypt = require("bcryptjs");
const User = require("../../model/userModel");

// Đăng ký
const registerUser = async (req, res) => {
  try {
    const { userName, passWord, email, name, phoneNumber, avtUrl, role } = req.body;

    // Kiểm tra xem tên người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({
        message: "Tên người dùng đã tồn tại!",
      });
    }

    // Mã hóa
    const hashedPassword = await bcrypt.hash(passWord, 10);

    // Tạo người dùng mới
    const newUser = new User({
      userName,
      passWord: hashedPassword,
      email,
      name,
      phoneNumber,
      avtUrl,
      role,
    });
    await newUser.save();
    res.status(201).json({
      message: "Đăng ký thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Đăng nhập
const loginUser = async (req, res) => {
  try {
    const { userName, passWord } = req.body;

    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({
        message: "Tên người dùng không tồn tại!",
      });
    }

    // So sánh mật khẩu đã mã hóa
    const isPasswordCorrect = await bcrypt.compare(passWord, user.passWord);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Mật khẩu không đúng!",
      });
    }
    res.status(200).json({
      message: "Đăng nhập thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Dang xuat
const logoutUser = async (req, res) => {
  try {
      const userId = req.user.id; 

      await User.findByIdAndUpdate(userId, { firebaseNotifications: [] });

      res.status(200).json({ message: 'Đã đăng xuất thành công' });
  } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng xuất' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser
};