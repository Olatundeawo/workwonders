const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address']

     },
    password: {type: String, required: true },
    role: {type: String, required: true },
    bio: String,
    profilePicture: String,
    projects: [{type: Schema.Types.ObjectId, ref: 'Project '}]
});


// Password is hashed before saving it
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return (next);
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password =  hash;
    next();
});

//  Virtual for user's URL

userSchema.virtual('url').get(function () {
    return `/user/${this._id}`;
})

module.exports = mongoose.model('User', userSchema);