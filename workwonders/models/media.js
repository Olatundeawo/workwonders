const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    title: { type: String, required: true},
    url: { type: Array, required: true},
    createAt: { type: Date, default: Date.now},
    project: { type: Schema.Types.ObjectId, ref: Project},
});

module.exports = mongoose.model("Video", videoSchema);