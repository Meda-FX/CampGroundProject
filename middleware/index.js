// Middleware
var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    // Checking if the user is logged in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found!");
                res.redirect("back");
            }
            else {
                // Check if background exists, if it does not exist throw an error and breake
                if (!foundCampground) {
                    req.flash("error", "Campground not found!");
                    return res.redirect("back");
                }
                // Check if the user that is loggd in owns the added campground information
                if (foundCampground.author.id.equals(req.user.id)) {
                    next();
                }
                else {
                    req.flash("error", "You dont have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        // It will send back the user to wher ethey came from
        req.flash("error", "You need to be logged in first!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    // Checking if the user is logged in
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                req.flash("error", "Campground not found!");
                res.redirect("back");
            }
            else {
                //check if the comment existed
                if (!foundComment) {
                    req.flash("error", "Sorry, the comment does not exist!");
                    res.redirect("/campgrounds");
                }
                // Check if the user that is loggd in owns the added comment information
                // we are comparing the moongoose id with the user passport id
                if (foundComment.author.id.equals(req.user.id)) {
                    next();
                }
                else {
                    req.flash("error", "You dont have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        // It will send back the user to wher ethey came from
        req.flash("error", "You need to be logged in first!");
        res.redirect("back");
    }
}

//Middleware that checks if a user is looged in  
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in first!");
    res.redirect("/login");
}

module.exports = middlewareObj;
