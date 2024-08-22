const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    powerSource: {type: String, required: true},
    category: {type: String, required: true},
    media: [{type: Schema.Types.ObjectId, ref: 'Media'}]
});

module.exports = mongoose.model('Project', projectSchema);