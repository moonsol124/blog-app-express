const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PictureSchema = new Schema({
    title: String,
    description: String,
    address: String,
    date: Date,
    comments: [{ type: Schema.Types.ObjectId, ref: 'PictureComment'}],
})

PictureSchema.virtual('url').get(function() {
    return `/picture/${this._id}`;
})

PictureSchema.virtual('id').get(function() {
    return this._id;
})

module.exports = mongoose.model('Picture', PictureSchema);