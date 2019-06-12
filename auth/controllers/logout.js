// logout
exports.logout = (req, res) => {
  req.logout();
  req.session.destroy(err => {
    req.user = null;
    res.redirect("/login");
  });
};
