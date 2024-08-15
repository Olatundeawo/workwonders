const User = require("../models/user");
const bcrypt = require('bcryptjs');
const { userCreateValidationRules, validate } = require("../validators/userValidator");
const asyncHandler = require('express-async-handler');

// Function that update user
async function updateUser(userId, updates) {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error ('user not found');

    }
     if (updates.email && updates.email !== user.email) {
        const exitingUser = await User.findOne({ email: updates.email });
        if (exitingUser) {
            throw new Error('Email is already in use');
        }
     }

     if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
     }

     Object.assign(user, updates);

     await user.save();

     return user;
}

//  Display all the users
exports.user_list = asyncHandler(async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json(err);
    }
});

// Display specific user
exports.user_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: User detail: ${req.params.id}`);
});

// Display user create form on GET
exports.user_create_get = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findOne({email});

        if (!user) {
            throw new Error('Invalid email or password')

            // res.status(201).json({message: "Has a user"});
        } 
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            throw new Error ('Invalid email or password');
        }

        return user;

    } catch (err) {
        res.status(500).json(err);
    }
});

// Display user create form on POST
exports.user_create_post = [
  userCreateValidationRules(),
  validate,
 asyncHandler(async (req, res, next) => {
    try {
        // Check if email already exists
        const existUser = await User.findOne({email: req.body.email });
        if (existUser) {
            // throw new Error("email already exists");
            return res.status(400).json({message: "Email already used" })
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(req.body.password, 10);

        // Create user
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
            role: req.body.role,
            bio: req.body.bio,
            profilePicture: req.body.profilePicture
    
    
    
        });
        
        await user.save();
        // return user;
        res.status(201). json({ message: "user created successfully ", user })
    } catch (err) {
        res.status(500).json(err)
    }
})
];

// Display user delete form on GET
exports.user_delete_get = asyncHandler(async (req, res, next) => {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).send('User not found')
    }

    res.render('user_delete', { title: 'Delete User', user})
});

// Handle user delete form on POST
exports.user_delete_post = asyncHandler(async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        return res.status(404).send('User not found');
    }
    await user.save();



});


// Display user update form on GET
exports.user_update_get = asyncHandler(async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).send('User not found');
    }
    res.render('user_form', { title: 'Update User', user})
});

// Handle user update form on POST
exports.user_update_post = asyncHandler(async (req, res, next) => {
    const userId = req.params.id;

    const update = {
        name: req.body.name,
            email: req.body.email,
            password: hashPassword,
            role: req.body.role,
            bio: req.body.bio,
            profilePicture: req.body.profilePicture
    };

    if (req.body.password) {
        update.password = req.body.password;
    }

    try {
        const updatedUser = await updateUser(userId, update);
        res.redirect(`/users/${userId}`); 
    } catch (err) {
        next(err);
    }

});

