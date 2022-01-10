const express = require("express");
const passport = require("passport");
const router = express.Router();
const catchAsync = require("../err/catchAsync");
const userController = require("../controllers/userController");

//- Register
router.route("/register")
  .get(userController.userRegister)
  .post(catchAsync(userController.registered))

//- Captcha
router.get("/create-captcha", userController.captcha);

//- Login
router.get("/login", (req, res) => {
  res.render("user/login", { title: "Login", count, endCount });
});
var count = 1;
var endCount = 3;
router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.cookie("failedLoggedIn", count++);
      req.flash(
        "error",
        "Your username or password is invalid. Please try again."
      );
      return res.redirect("/login");
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      if (count > endCount) {
        let secCaptcha = req.session.captcha;
        let inputCaptcha = req.body.captcha;
        if (secCaptcha !== inputCaptcha) {
          req.flash("error", "Captcha is invalid, please try again.");
          return res.redirect("/login");
        }
      }
      res.clearCookie("failedLoggedIn");
      count = 0;
      let username = req.body.username;
      req.flash(
        "success",
        `Welcome back, ${username[0].toUpperCase() + username.slice(1)}!`
      );
      const redirectUrl = req.session.returnTo || "/campgrounds";
      delete req.session.returnTo;
      res.redirect(redirectUrl);
    });
  })(req, res, next);
});

//- Logout
router.get("/logout", userController.logout);
module.exports = router;

// var count = 1
// router.post("/login", function (req, res, next) {
//   passport.authenticate("local", function (err, user, info) {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       res.cookie("failedLoggedIn", count++)
//       req.flash('error', "Your username or password  is invalid. Please try again. ")
//       if(count > 2) {
//         let secCaptcha = req.session.captcha
//         let inputCaptcha = req.body.captcha;
//         let result = 'True'
//         if (secCaptcha != inputCaptcha) {
//             result = 'False'
//         }
//     }
//     return res.redirect("/login");
//     }
//     req.logIn(user, function (err) {
//       if (err) {
//         return next(err);
//       }
//       res.clearCookie("failedLoggedIn");
//       count = 0
//       let username = req.body.username;
//       req.flash(
//         "success",
//         `Welcome back, ${username[0].toUpperCase() + username.slice(1)}!`
//       );
//       const redirectUrl = req.session.returnTo || "/campgrounds";
//       delete req.session.returnTo;
//       res.redirect(redirectUrl);
//     });
//   })(req, res, next);
// });

// router.post('/login', passport.authenticate('local', {
//   failureFlash: true,
//   failureRedirect: '/login'
// }), (req,res) => {
//   let secCaptcha = req.session.captcha
//   let inputCaptcha = req.body.captcha;
//   if (secCaptcha !== inputCaptcha) {
//       req.flash('error', 'Captcha is invalid, please try again.')
//       res.redirect('/login');
//   }
//   let username = req.body.username
//   req.flash('success', `Welcome back, ${username[0].toUpperCase() + username.slice(1)}!`);
//   const redirectUrl = req.session.returnTo || '/campgrounds';
//   delete req.session.returnTo;
//   res.redirect(redirectUrl);
// })
