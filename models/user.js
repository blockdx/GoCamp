var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: { type: String, default: "" },
    firstName: String,
    lastName: String,
    email: String,
    bio: String,
    commentCount: { type: Number, default: 0 },
    campCount: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);