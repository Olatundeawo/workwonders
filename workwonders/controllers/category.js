const Category = require("../models/category");
const asyncHandler = require('express-async-handler');

//  Display all categories
exports.category_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: category list");
});

// Display specific category
exports.category_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Category detail: ${req.params.id}`);
});

// Display category create form on GET
exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.send(' NOT IMPLEMENTED: Category create GET');
});

// Display category create form on POST
exports.category_create_post = asyncHandler(async (req, res, next) => {
    res.send(' NOT IMPLEMENTED: Category create POST');
});

// Display category delete form on GET
exports.category_delete_get = asyncHandler(async (req, res, next) => {
    res.send(' NOT IMPLEMENTED: Category delete GET');
});

// Handle category delete form on POST
exports.category_delete_post = asyncHandler(async (req, res, next) => {
    res.send(' NOT IMPLEMENTED: Category delete POST');
});


// Display category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
    res.send(' NOT IMPLEMENTED: Category update GET');
});

// Handle category update form on POST
exports.category_update_post = asyncHandler(async (req, res, next) => {
    res.send(' NOT IMPLEMENTED: Category update POST');
});
