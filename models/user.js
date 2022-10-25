const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    password: String,
})

UserSchema.virtual('url').get(function() {
    return `/user/${this._id}`;
})

module.exports = mongoose.model('User', UserSchema);