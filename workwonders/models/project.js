const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    startDate: {type: Date},
    endDate: {type: Date},
    status: {type: String, enum: ['ongoing', 'completed'], default: 'ongoing'},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    media: [{type: Schema.Types.ObjectId, ref: 'Media'}]
});

module.exports = mongoose.model('Project', projectSchema);