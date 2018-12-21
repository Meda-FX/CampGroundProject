var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [{
        name: "Sylvana Lake Camp",
        image: "https://images.unsplash.com/photo-1524880109260-7ba81ca1d749?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1dc59607a2282dfa5a4621938ebb4cf5&auto=format&fit=crop&w=754&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nulla facilisi nullam vehicula ipsum a arcu cursus vitae congue. A erat nam at lectus urna. Etiam sit amet nisl purus. Varius morbi enim nunc faucibus a. Risus nec feugiat in fermentum posuere urna nec tincidunt praesent. At tempor commodo ullamcorper a lacus vestibulum sed arcu. Justo laoreet sit amet cursus sit."
    },
    {
        name: "Banff Camp",
        image: "https://images.unsplash.com/photo-1505232530843-7e94d7faac73?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c57fb6c7ac06a378656f493f96592ef5&auto=format&fit=crop&w=750&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nulla facilisi nullam vehicula ipsum a arcu cursus vitae congue. A erat nam at lectus urna. Etiam sit amet nisl purus. Varius morbi enim nunc faucibus a. Risus nec feugiat in fermentum posuere urna nec tincidunt praesent. At tempor commodo ullamcorper a lacus vestibulum sed arcu. Justo laoreet sit amet cursus sit. "
    },
    {
        name: "Olds Rec Camp",
        image: "https://images.unsplash.com/photo-1528433556524-74e7e3bfa599?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a4479c0b22e5c8a8ed5577c39f63b27b&auto=format&fit=crop&w=750&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nulla facilisi nullam vehicula ipsum a arcu cursus vitae congue. A erat nam at lectus urna. Etiam sit amet nisl purus. Varius morbi enim nunc faucibus a. Risus nec feugiat in fermentum posuere urna nec tincidunt praesent. At tempor commodo ullamcorper a lacus vestibulum sed arcu. Justo laoreet sit amet cursus sit. "
    }
]

function seedDB() {
    // Remove all campgrounds
    Campground.remove(function(err) {
        if (err) {
            console.log(err);
        }
        console.log("Removed all data from the database!!");
    });

    //ADD new campgrounds
    data.forEach(function(seed) {
        Campground.create(seed, function(err, campground) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Added a Camp Groud!!!");
                //ADD Comments
                Comment.create({
                    text: "This place is nice, but there is no internet availabale.",
                    author: "Peter"
                }, function(err, comment) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        campground.comments.push(comment);
                        campground.save();
                        console.log("Created a new comment.");
                    }
                });
            }
        });
    });
}

module.exports = seedDB;
