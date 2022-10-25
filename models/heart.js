const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HeartSchema = new Schema({
    picture: { type: Schema.Types.ObjectId, ref: 'Picture'},
    pictureId: String,
    likes: Number,
})

HeartSchema.virtual('id').get(function() {
    return this._id;
})

module.exports = mongoose.model('Heart', HeartSchema);