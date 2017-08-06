var mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    data       = [
            {
                name: "Cloud's Rest",
                image: "https://cdn.pixabay.com/photo/2015/05/23/00/25/utah-780108_960_720.jpg",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus finibus lobortis hendrerit. Vestibulum eu lacus turpis. Aliquam id placerat felis. Duis dolor erat, tincidunt ac varius quis, blandit non mauris. Nam sodales scelerisque ligula, nec blandit orci pulvinar at. Morbi dapibus sem eu metus auctor bibendum. Fusce nisl massa, dignissim mattis vulputate ut, mollis non diam. Aenean et eros urna."
            },
            {
                name: "Turtle Run",
                image: "https://cdn.pixabay.com/photo/2017/07/17/16/21/turkey-2512944_960_720.jpg",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus finibus lobortis hendrerit. Vestibulum eu lacus turpis. Aliquam id placerat felis. Duis dolor erat, tincidunt ac varius quis, blandit non mauris. Nam sodales scelerisque ligula, nec blandit orci pulvinar at. Morbi dapibus sem eu metus auctor bibendum. Fusce nisl massa, dignissim mattis vulputate ut, mollis non diam. Aenean et eros urna."            
            },
            {
                name: "Canyon Floor",
                image: "https://cdn.pixabay.com/photo/2016/01/26/23/32/camp-1163419_960_720.jpg",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus finibus lobortis hendrerit. Vestibulum eu lacus turpis. Aliquam id placerat felis. Duis dolor erat, tincidunt ac varius quis, blandit non mauris. Nam sodales scelerisque ligula, nec blandit orci pulvinar at. Morbi dapibus sem eu metus auctor bibendum. Fusce nisl massa, dignissim mattis vulputate ut, mollis non diam. Aenean et eros urna."            
            },
            {
                name: "Devil's Den",
                image: "https://cdn.pixabay.com/photo/2016/08/28/17/05/camping-1626412_960_720.jpg",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus finibus lobortis hendrerit. Vestibulum eu lacus turpis. Aliquam id placerat felis. Duis dolor erat, tincidunt ac varius quis, blandit non mauris. Nam sodales scelerisque ligula, nec blandit orci pulvinar at. Morbi dapibus sem eu metus auctor bibendum. Fusce nisl massa, dignissim mattis vulputate ut, mollis non diam. Aenean et eros urna."            
            }
    ];
function seedDB() {
    //remove all campgrounds
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        console.log("Removed Campgrounds");
        // data.forEach(function(seed) {
        //     //create campgrounds
        //     Campground.create(seed, function(err, campground) {
        //         if (err) {
        //             console.log(err);
        //         } else {
        //             console.log("Campground Added.");
        //             //create comments
        //             Comment.create(
        //                 {
        //                     text: "This place is great, but I wish there was internet.",
        //                     author: "Homer"
        //                 }, function(err, comment) {
        //                     if (err) {
        //                         console.log(err);
        //                     } else {
        //                         campground.comments.push(comment);
        //                         campground.save();
        //                         console.log("Created Comment.");
        //                     }
        //                 });
        //         }
        //     });
        // });
    });
    //add few campgrounds
}

module.exports = seedDB;
