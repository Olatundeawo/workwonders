const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name: {type: String,
         required: [true, 'Name is required'],
         minlength: [3, 'Name must be at least 3 characters long']
        },
    email: {type: String,
         required: [true, "Email is required"],
         unique: true, 
        trim: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email address'
        }

     },
    password: {type: String,
         required:[true, "Password is reqired"]
         },
    role: {type: String, 
        required: [true, "Role is required"] 
    },
    bio: String,
    profilePicture: String,
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