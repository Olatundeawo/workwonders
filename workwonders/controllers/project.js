const Project = require("../models/project");
const validateProject = require("../validators/projectValidator");
const asyncHandler = require("express-async-handler");
const validator = require("express-validator");
const body = validator.body;
const validationResult = validator.validationResult
const multer = require('multer');
const path = require('path');



exports.index = asyncHandler(async(req, res, next) => {
    res.render('index');
})

//  Display all projects
exports.project_list = asyncHandler(async(req, res, next) => {
    const projects = await Project.find();

    res.render('projects',{projects:projects})
});

// Display a particular project
exports.project_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Project detail: ${req.params.id}`);
});

// Display project create form on Get
exports.project_create_get = asyncHandler(async (req, res, next) => {
    res.render('project_form',{title: "Create Project"});
});

// Handle project create on POST
exports.project_create_post = asyncHandler(async (req, res, next) => {
    
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract validation errors from a request
        const errors = validationResult(req);

        // Create project
        const project = new Project({
            title: req.body.title,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            status: req.body.status,
            media: req.body.media,
            category: req.body.category
        });

        if (!errors.isEmpty()) {
            res.render('project_form');
            return;
        } else {
            await project.save();
            res.redirect(author.url);
        }
    })
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

