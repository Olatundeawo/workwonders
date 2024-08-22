const User = require("../models/user");
const bcrypt = require('bcryptjs');
const { userCreateValidationRules, validate } = require("../validators/userValidator");
const asyncHandler = require('express-async-handler');



//  Display all the users
exports.user_list = asyncHandler(async (req, res, next) => {
    
    try {
        const users = await User.find();
        res.status(200).json(users);
        // res.render('projects',{projects:projects})
    } catch (err) {
        const errs = {"error": "unable to process the request"}
        res.send("unable to access the database")
    }
});

// Display specific user
exports.user_detail = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    const user = await User.findById(id);

    if (!user) {
        return res.json({Error: 'No User with the id', id})
    }

    res.json(user);
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

        res.json(user);

    } catch (err) {
        res.status(500).json(err);
    }
});

// Display user create form on POST
exports.user_create_post = asyncHandler(async (req, res, next) => {
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
});


// Display user delete form on GET
exports.user_delete_get = asyncHandler(async (req, res, next) => {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).send('User not found')
    }

    res.json(user)
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
    res.json(user);
});

// Handle user update form on POST
exports.user_update_post = asyncHandler(async (req, res, next) => {
    const userId = req.params.id;

    let hashPassword;
    if (req.body.password) {
        hashPassword = await bcrypt.hash(req.body.password, 10);
    }

    const update = {
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
            role: req.body.role,
            bio: req.body.bio,
            profilePicture: req.body.profilePicture
    };

    if (req.body.password) {
        update.password = hashPassword;
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, update, {
            new: true
        });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found "})
        }

        res.json(updatedUser) 
    } catch (err) {
        next(err);
    }

});

