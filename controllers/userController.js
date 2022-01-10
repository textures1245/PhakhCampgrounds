const User = require("../models/user");
const svgCaptchar = require("svg-captcha");
const recaptcha = require("recaptcha-v3");

module.exports.userRegister = (req, res) => {
  res.render("user/register", { title: "Register" });
};

module.exports.registered = async (req, res, next) => {
    try {
      const { username, password, password2, email } = req.body;
      if (password !== password2) {
        req.flash("error", "Your both password are incorrect, please try again.")
        return res.redirect("/register");
      }
      const user = new User({ email, username });
      const registerId = await User.register(user, password);
      req.login(registerId, (err) => {
        if (err) return next(err);
        req.flash(
          "success",
          "Register Successfully. Welcome to Phakh-Campers."
        );
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message + ", please try again.");
      res.redirect("/register");
    }
  }

module.exports.captcha = (req, res) => {
  let captcha = svgCaptchar.create({ size: 4, noise: 2, background: "#ddd" });
  req.session.captcha = captcha.text;
  res.type("svg");
  res.send(captcha.data);
}


module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Farewell, hope you come back later!");
  res.redirect("/campgrounds");
}