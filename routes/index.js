var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// INDEX Page routes
router.get("/", function(req, res) {
    res.render("landing");
});

/*********************** Authentication Routes *********************/
router.get("/register", function(req, res) {
    res.render("register");
});

// handling user sign up logic  
router.post("/register", function(req, res) {
    // get the values from the register form  
    var username = req.body.username;
    var password = req.body.password;
    var newUser = new User({ username: username });
    User.register(newUser, password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp " + user.username.toUpperCase());
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login", function(req, res) {
    res.render("login");
});

//POST the form to ligin  -- the passport.authenticate is a middelware
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(res, req) {});

// LOGOUT - routes
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged Out Successfuly!");
    res.redirect("/campgrounds");
})

module.exports = router;
