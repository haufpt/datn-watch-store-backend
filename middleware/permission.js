const checkRole = (roles) => {
  return (req, res, next) => {
    if (req.session.userLogin && roles.includes(req.session.userLogin.role)) {
      next();
    } else {
      res.redirect("/login");
    }
  };
};

module.exports = {
  checkRole,
};
