const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {
        type: String, required:[true, "project title is required"],
    },
    description: {
        type: String, 
        required: [true, "Give a description of the project"],
    },
    powerSource: {
        type: String, 
        required: [true, "Power source is required"]
    },
    category: {type: String, required: true},
    media: [{type: Schema.Types.ObjectId, ref: 'Media'}]
});

module.exports = mongoose.model('Project', projectSchema);