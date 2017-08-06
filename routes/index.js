var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/user");

router.get("/", function(req, res) {
    res.render("landing");
});

router.get("/register", function(req, res) {
   res.render("register", {page: "register"}); 
});
//register
router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
        });
    if (req.body.adminCode === "v-vGh2qPB6") {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("register");
        } else {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome to GoCamp, " + user.username + "!");
                res.redirect("/campgrounds");
            });
        }
    });
});

//show login form
router.get("/login", function(req, res) {
    res.render("login", {page: "login"});
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { req.flash("error", "Username or password is incorrect"); return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { req.flash("error", err.message); return next(err); }
      var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/campgrounds';
      delete req.session.redirectTo;
      req.flash("success", "Welcome back, " + user.username + "!");
      res.redirect(redirectTo);
    });
  })(req, res, next);
});

//logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out successfully.");
    res.redirect("/campgrounds");
});


module.exports = router;



