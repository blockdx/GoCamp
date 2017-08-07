var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    User       = require("../models/campground"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware"),
    geocoder = require('geocoder');
    
router.get("/", function(req, res) {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({name: regex}, function (err, allCampgrounds) {
            if (err) { 
                console.log(err);
            }
            else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user, page: "campgrounds"});
            }
        });
    } else {
        Campground.find({}, function (err, allCampgrounds) {
            if (err) { 
                console.log(err);
            }
            else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user, page: "campgrounds"});
            }
        });
    }
});
//post request for new
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
        if (err) { req.flash("error", err.message); res.redirect("/campgrounds"); }
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newCampground = {name: name, image: image, description: description, author: author, price: price, location: location, lat: lat, lng: lng};
        Campground.create(newCampground, function (err, newlyCreated) {
            if (err) { 
                console.log(err);
            }
            else {
                req.flash("success", "The campground has been added");
                res.redirect("/campgrounds");
            }
        });
    });
});
//new
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});
//show info
router.get("/:id", function(req, res) {
    // find campground with ID
    // render show
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});
//edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        }
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});
//update
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  geocoder.geocode(req.body.location, function (err, data) {
    if (err) {
        console.log(err);
        req.flash("error", err.message);
        res.redirect("back");
    }      
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});

//destroy
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err, deletedCampground) {
       if (err) {
           console.log(err);
           res.redirect("back");
       } else {
           deletedCampground.comments.forEach(function(comment) {
               
               Comment.findByIdAndRemove(comment, function(err, deletedComment) {
                  if (err) {
                      console.log(err);
                  }
               });
           });
           req.flash("success", "Campground deleted");
           res.redirect("/campgrounds/");
       }
       //eval(require("locus"));
    });                   
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;