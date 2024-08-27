const Project = require("../models/project");
const Media = require("../models/media");
const asyncHandler = require("express-async-handler");
const bucket = require('../firebase');


//  Display all projects
exports.project_list = asyncHandler(async (req, res, next) => {
  try {
    const projects = await Project.find();
    if (!projects) {
      res.json({ Error: "Try to create a project" })
    }

    res.status(200).json(projects);
  } catch (err) {
    if (err.name === 'validationError') {
      res.status(400).json({ Error: err.message })
    }
    res.status(500).json({ "Error": "Internal server error occured" });
  }

});

// Display a particular project
exports.project_detail = asyncHandler(async (req, res, next) => {
  const projectDetail = req.params.id;

  try {
    const project = await Project.findById(projectDetail);
    if (!project) {
      res.json({
        error: "Project not found"
      })
    }

    res.json(project)
  } catch (err) {
    if (err.name === 'validationError') {
      res.status(400).json({ Error: err.message })
    }
    res.json(`{Error:  ${projectDetail} is not a valid product Id}`)
  }



});

// Display project create form on Get
exports.project_create_get = asyncHandler(async (req, res, next) => {
  res.json(Project)
});

// Handle project create on POST
exports.project_create_post = asyncHandler(async (req, res, next) => {
  // Extract validation errors from the request

  try {

    // Create a new project instance
    const project = new Project({
      title: req.body.title,
      description: req.body.description,

      powerSource: req.body.powerSource,
      category: req.body.category
    });

    if (req.files && req.files.length > 0) {
      const mediaIds = [];

      for (const file of req.files) {
        const blob = bucket.file(Date.now().toString() + '-' + file.originalname);
        const blobStream = blob.createWriteStream({
          metadata: {
            contenType: file.mimetype,
          },
        });

        blobStream.on('finish', async () => {
          const publicUrl = `https://firebasestorage.googleapis.com/v0/b/workwonders-f537b.appspot.com/o/${encodeURIComponent(blob.name)}?alt=media`;

          const media = new Media({
            type: file.mimetype.startsWith('image/') ? 'image' : 'video',
            url: publicUrl,
            project: project._id
          });

          await media.save();
          mediaIds.push(media._id);
        });

        blobStream.end(file.buffer);
      }

      project.media = mediaIds;
    }


    // Save the project if no errors
    await project.save();
    // Redirect to the newly created project's URL
    res.status(201).json({ message: "Project created successfully", project })

  } catch (err) {
    if (err.name === 'validationError') {
      res.status(400).json({ Error: err.message })
    }
    res.status(500).json({ Error: 'An internal server error occured' })
  }
});

// Display project delete form on GET
exports.project_delete_get = asyncHandler(async (req, res, next) => {
  const projectId = req.params.id;

  try {

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });

    }

    res.json(project);
  } catch (err) {
    res.json(`Error: ${projectId} is not a valid project Id `);
  }
});


// Handle project delete on POST
exports.project_delete_post = asyncHandler(async (req, res, next) => {
  const projectId = req.params.id;

  const project = await Project.findById(projectId).populate('media');

  if (!project) {
    return res.status(404).json({ error: 'Project not found ' });
  }

  // Delete media from Firebase Storage and mongodb
  for (const media of project.media) {
    const fileName = media.url.split('/').pop().split('?')[0];
    const file = bucket.file(fileName);

    await file.delete().catch(err => {
      console.error(`Failed to delete file: ${media.url}`, err);
    });

    await Media.findByIdAndDelete(media._id);
  }

  // Delete the  project itself

  await Project.findByIdAndDelete(projectId);
  res.json({ message: 'Project successfully deleted', project })
});


// Display project update on GET
exports.project_update_get = asyncHandler(async (req, res, next) => {
  const projectId = req.params.id;

  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ Error: 'Project not found' })
  }

  res.json(project);
});


// Handle project UPDATE on POST
exports.project_update_post = asyncHandler(async (req, res, next) => {
  try {

    const projectId = req.params.id;

    const project = {
      title: req.body.title,
      description: req.body.description,
      powerSource: req.body.powerSource,
      category: req.body.category
    };
    if (req.files && req.files.length > 0) {
      const mediaIds = [];

      for (const file of req.files) {
        const blob = bucket.file(Date.now().toString() + '-' + file.originalname);
        const blobStream = blob.createWriteStream({
          metadata: {
            contenType: file.mimetype,
          },
        });

        blobStream.on('finish', async () => {
          const publicUrl = `https://firebasestorage.googleapis.com/v0/b/workwonders-f537b.appspot.com/o/${encodeURIComponent(blob.name)}?alt=media`;

          const media = new Media({
            type: file.mimetype.startsWith('image/') ? 'image' : 'video',
            url: publicUrl,
            project: project._id
          });

          await media.save();
          mediaIds.push(media._id);
        });

        blobStream.end(file.buffer);
      }

      project.media = mediaIds;
    }

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        project: project
      });
    } else {
      const updatedProject = await Project.findByIdAndUpdate(projectId, project, { new: true });

      if (!updatedProject) {
        return res.status(404).json({ error: 'Project not found' })
      }

      res.json(updatedProject);
    }
  } catch (err) {
    if (err.name === 'validationError') {
      res.status(400).json({ Error: err.message })
    }
    res.status(500).json({ Error: "An internal server error occur" })
  }
});