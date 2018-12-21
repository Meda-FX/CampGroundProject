var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local");

// Requiring Routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

// variable that has a backup path to a database connection
var dbUrl = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v13"
// the database we createdin C9
mongoose.connect(dbUrl);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());


// This function always runs when we start the app - see the functionalities inside seeds.js file
//seedDB();

//PSSPORT Configuration
app.use(require("express-session")({
    secret: "Man United is Shit.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// make user available
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Using the route files - with path added to dry up the code
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server Has Started!!!");
});
