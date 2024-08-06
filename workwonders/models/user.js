const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true },
    role: {type: String, required: true },
    bio: String,
    profilePicture: String,
    projects: [{type: Schema.Types.ObjectId, ref: 'Project '}]
});

//  Virtual for user's URL

userSchema.virtual('url').get(function () {
    return `/user/${this._id}`;
})

module.exports = mongoose.model('User', userSchema);