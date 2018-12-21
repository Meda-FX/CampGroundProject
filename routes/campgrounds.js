var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX - shows all campgrounds
router.get("/", function(req, res) {
    // get all campgrounds 
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log("Error adding a data to the Yelp DB!");
        }
        else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user });
        }
    });
});

// NEW - Show a form to add new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//CREATE - used to add a new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    // get data from form and add campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampGround = { name: name, image: image, description: description, price: price, author: author };
    Campground.create(newCampGround, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//Show campground
router.get("/:id", function(req, res) {
    // find the campground with a provided ID
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            // render show template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    // Find and update the correct campgrounds
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

//Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    // Getting the campground we need to update
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//delete campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
