const User = require("../models/user");
const asyncHandler = require('express-async-handler');

//  Display all the users
exports.user_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User list");
});

// Display specific user
exports.user_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: User detail: ${req.params.id}`);
});

// Display user create form on GET
exports.user_create_get = asyncHandler(async (req, res, next) => {
    res.send(' NOT IMPLEMENTED: User create GET');
});

// Display user create form on POST
exports.user_create_post = asyncHandler(async (req, res, next) => {
    res.send(' NOT IMPLEMENTED: User create POST');
});

// Display user delete form on GET
exports.user_delete_get = asyncHandler(async (req, res, next) => {
    res.send(' NOT IMPLEMENTED: User delete GET');
});

// Handle user delete form on POST
exports.user_delete_post = asyncHandler(async (req, res, next) => {
    res.send(' NOT IMPLEMENTED: User delete POST');
});


// Display user update form on GET
exports.user_update_get = asyncHandler(async (req, res, next) => {
    res.send(' NOT IMPLEMENTED: User update GET');
});

// Handle user update form on POST
exports.user_update_post = asyncHandler(async (req, res, next) => {
    res.send(' NOT IMPLEMENTED: User update POST');
});

