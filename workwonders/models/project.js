const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    startDate: {type: Date},
    endDate: {type: Date},
    status: {type: String, enum: ['ongoing', 'completed'], default: 'ongoing'},
    images: [String],
    category: {type: Schema.Types.ObjectId, ref: 'Category'}
});

module.exports = mongoose.model('Project', projectSchema);