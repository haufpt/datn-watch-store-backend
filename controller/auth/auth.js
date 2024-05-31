const dbAuth = require('../../model/userModel');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { username, passwd } = req.body;
        console.log("req userName: ", username);
        console.log("req password: ", passwd);

        var user = await dbAuth.find({ "username": username });
        console.log("user: ", user);

        if(user.length != 1){
           return res.status(301).json({
                success: false,
                message: "User not found"
            });
        }

        if (passwd != user[0].passwd){
            return res.status(301).json({
                success: false,
                message: "Email or password incorrect"
            });
        }
        const secretKey = 'this-is-my-secret-key';
        const token = jwt.sign(req.body, secretKey);

        res.status(200).json({
            success: true,
            data: {
                information: user,
                token: token
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
      const newUser = req.body;
      console.log("req: ", newUser);
      var isEmpty = await dbAuth.find({ username: newUser.username });
      if (isEmpty.length != 0){
          return res.status(301).json({
              success: false,
              message: `User is exist !`,
          });
      }
  
      const newUserModel = new dbAuth(newUser);
      await newUserModel.save();
  
      res.status(200).json({
        success: true,
        message: `Sign up successfully !`,
      });
    } catch (error) {
        console.log("Erol: ", error.message);
      res.status(500).json({
        success: false,
        message: `${error.message}`,
      });
    }
  };

module.exports = {
    login,
    singup
};
