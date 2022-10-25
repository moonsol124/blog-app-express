const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    username: String,
    password: String,
    title: String,
    content: String,
    postid: String,
    date: Date,
})

CommentSchema.virtual('url').get(function() {
    return `/post/:postid/comment/${this._id}`;
})

CommentSchema.virtual('id').get(function() {
    return `${this._id}`;
})

module.exports = mongoose.model('Comment', CommentSchema);