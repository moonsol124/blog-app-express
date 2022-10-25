const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    author: String,
    title: String,
    content: String,
    picture: String,
    date: Date,
    description: String,
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],
})

PostSchema.virtual('url').get(function() {
    return `/post/${this._id}`;
})

PostSchema.virtual('id').get(function() {
    return this._id;
}) 

module.exports = mongoose.model('Post', PostSchema);