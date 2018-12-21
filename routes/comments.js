var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Comments new
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new", { campground: campground });
        }
    });
});

// Comments Create
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                }
                else {
                    // add username and id
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    // save to comment
                    comment.save();
                    // Then we push the comment to the campground 
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "You have created a comment successfully");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Comments edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            req.flash("error", "Something went wrong!");
        }
        else {
            req.flash("success", "Successfully edited a comment!");
            res.render("comments/edit", { comment: foundComment, campground_id: req.params.id });
        }
    });
});

//Update a comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        }
        else {
            req.flash("success", "Successfully updated a comment!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE a comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        }
        else {
            req.flash("success", "Successfully deleted a comment!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
