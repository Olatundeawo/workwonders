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
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
        // res.render('projects',{projects:projects})
    } catch (err) {
        const errs = {"error": "unable to process the request"}
        res.send("unable to access the database")
    }

});

// Display a particular project
exports.project_detail = asyncHandler(async (req, res, next) => {
    const projectDetail = req.params.id;

    const project = await Project.findById(projectDetail);

    if (!project) {
        res.json({
            error: "Project not found"
        })
    }

    res.json(project)
});

// Display project create form on Get
exports.project_create_get = asyncHandler(async (req, res, next) => {
    res.json(Project)
});

// Handle project create on POST
exports.project_create_post = asyncHandler(async (req, res, next) => {
    // Extract validation errors from the request
    const errors = validationResult(req);

    // Create a new project instance
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
        // If there are validation errors, re-render the form with error messages and input data
        res.json({

            errors: errors.array() // Pass the validation errors to the view
        })
    
    } else {
        // Save the project if no errors
        await project.save();
        // Redirect to the newly created project's URL
        res.json(project);
    }
});

// Display project delete form on GET
exports.project_delete_get = asyncHandler(async (req, res, next) => {
    const projectId = req.params.id;

    const project = await Project.findById(projectId);

    if (!project) {
        return res.status(404).json({error: 'Project not found'});

    }

    res.json(project);
});


// Handle project delete on POST
exports.project_delete_post = asyncHandler(async (req, res, next) => {
    const projectId = req.params.id;

    const project = await Project.findByIdAndDelete(projectId);

    if (!project) {
        return res.status(404).json({error: 'Project not found '});
    }

    res.json({message: 'Project successfully deleted', project })
});


// Display project update on GET
exports.project_update_get = asyncHandler(async (req, res, next) => {
    const projectId = req.params.id;

    const project = await Project.findById(projectId);

    if (!project) {
        return res.status(404).json({Error: 'Project not found'})
    }

    res.json(project);    
});


// Handle project UPDATE on POST
exports.project_update_post = asyncHandler(async (req, res, next) => {
    const projectId = req.params.id;

    const projectData = {
        title: req.body.title,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        status: req.body.status,
        media: req.body.media,
        category: req.body.category
    };

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            project: projectData
        });
    } else {
        const updatedProject = await Project.findByIdAndUpdate(projectId, projectData, {new: true});

        if (!updatedProject) {
            return res.status(404).json({error: 'Project not found'})
        }

        res.json(updatedProject);
    }
});

