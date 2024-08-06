const Project = require("../models/project");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async(req, res, next) => {
    res.send("NOT IMPLEMENTED: Home page site")
})

//  Display all projects
exports.project_list = asyncHandler(async(req, res, next) => {
    res.send("NOT IMPLEMENTED: project list");
});

// Display a particular project
exports.project_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Project detail: ${req.params.id}`);
});

// Display project create form on Get
exports.project_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: project create GET");
});

// Handle project create on POST
exports.project_create_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Project create on POST');
});


// Display project delete form on GET
exports.project_delete_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Project delete on GET');
});


// Handle project delete on POST
exports.project_delete_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Project delete on POST');
});


// Display project update on GET
exports.project_update_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Project update on GET');
});


// Handle project UPDATE on POST
exports.project_update_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Project update on POST');
});

