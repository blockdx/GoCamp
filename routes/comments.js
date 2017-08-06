var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    User       = require("../models/user"),
    middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            req.flash("error", "Critical error!");
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                //add username and id to comment and save
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    req.user.commentCount++;
                    req.user.save();
                    campground.commentCount++;
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully created comment!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    });
});
//get edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});            
        }
    });
});
//put edit
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
       if (err) {
           console.log(err);
            res.redirect("back");
       } else {
           req.flash("success", "Successfully edited comment");
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});
//delete comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            req.flash("error", err.message);
        } else {
            campground.commentCount--;
            campground.save();
        }
    });
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            User.findById(foundComment.author.id, function (err, foundUser) {
               if (err) {
                   console.log(err);
                   res.redirect("back");
               } else {
                   foundUser.commentCount--;
                   foundUser.save();
                    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
                       if (err) {
                           console.log(err);
                           res.redirect("back");
                       } else {
                            req.flash("success", "Comment deleted");
                            res.redirect("/campgrounds/" + req.params.id);
                       } 
                    });                   
               }
            });
        }
    });  
});

module.exports = router;