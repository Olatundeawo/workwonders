const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {
        type: String, required: [true, "project title is required"],
    },
    description: {
        type: String,
        required: [true, "Give a description of the project"],
    },
    powerSource: {
        type: String,
        required: [true, "Power source is required"]
    },
<<<<<<< HEAD
    category: {type: String, required: true},
    media: [{type: Schema.Types.ObjectId, ref: 'Video'}]
=======
    category: { type: String, required: true },
    media: [{ type: Schema.Types.ObjectId, ref: 'Video' }]
>>>>>>> d891da3da602535339c7556c822f50bc9b6a5f75
});

module.exports = mongoose.model('Project', projectSchema);