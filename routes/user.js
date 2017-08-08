var express    = require("express"),
    router     = express.Router(),
    User       = require("../models/user"),
    Campground = require("../models/campground"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware");

//show user profile    
router.get("/:id", function(req, res) {
   User.findById(req.params.id, function(err, foundUser) {
       if (err) {
           req.flash("error", err.message);
           res.redirect("/");
       }
       var campgrounds = [];
       var comments = [];
       var data = {};
       var commentsWithNames = [];
       var newComment;
       Campground.find().where('author.id').equals(foundUser._id).exec(function (err, foundCampgrounds) {
           if (err) {
               console.log(err);
           }
           foundUser.campCount = Object.keys(foundCampgrounds).length;
           foundUser.save();
           campgrounds = foundCampgrounds;
       });
       Comment.find().where('author.id').equals(foundUser._id).exec(function (err, foundComments) {
           if (err) {
               console.log(err);
           }
           foundUser.commentCount = Object.keys(foundComments).length;
           foundUser.save();
           if (Object.keys(foundComments).length >=5) {
               foundComments.slice(Math.max(Object.keys(foundComments).length - 5, 1))
           }
           comments = foundComments;
           comments.forEach(function(usersComment) {
              Campground.find({}, function (err, allCampgrounds) {
                 allCampgrounds.forEach(function(camp) {
                     camp.comments.forEach(function(comment) {
                         if (usersComment.id == comment) {
                             newComment = {
                                 name: camp.name,
                                 id: comment,
                                 campId: camp.id,
                                 text: usersComment.text,  
                                 date: usersComment.createdAt
                             };
                             commentsWithNames.push(newComment);
                         }
                     });
                 });
              });
            });
        // console.log(commentsWithNames);
           //eval(require("locus"));
           
           res.render("user/show", {user: foundUser, page: "user", campgrounds: campgrounds, comments: commentsWithNames});

       });
   });
});
//show profile edit page
router.get("/:user_id/edit", middleware.checkProfileOwnership, function(req, res) {
    User.findById(req.params.user_id, function(err, foundUser) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("user/edit", {user: foundUser});            
        }
    });
});
//update profile
router.put("/:user_id", middleware.checkProfileOwnership, function(req, res) {
    var newData = {firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, avatar: req.body.avatar, bio: req.body.bio};
    User.findByIdAndUpdate(req.params.user_id, {$set: newData}, function(err, updatedUser) {
       if (err) {
           console.log(err);
            res.redirect("back");
       } else {
           req.flash("success", "Successfully edited profile");
           res.redirect("/user/" + req.params.user_id);
       }
   });
});

module.exports = router;