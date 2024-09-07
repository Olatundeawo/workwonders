const Project = require("../models/project");
const Media = require("../models/media");
const asyncHandler = require("express-async-handler");
const bucket = require('../firebase');

//fetch all projects
exports.project_list = asyncHandler(async (req, res, next) => {
    try {
        const projects = await Project.find().populate('media');
        if (!projects || projects.length === 0) {
            return res.status(404).json({ Error: "No projects found" });
        }
        res.status(200).json(projects);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ Error: err });
        }
        // res.status(500).json({ Error: err });
    }
});


// Display a particular project
exports.project_detail = asyncHandler(async (req, res, next) => {
    const projectDetail = req.params.id;

    try {
        const project = await Project.findById(projectDetail).populate('media');
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
    try {
        console.log("Request body:", req.body);

        const project = new Project({
            title: req.body.title,
            description: req.body.description,
            powerSource: req.body.powerSource,
            category: req.body.category,
        });

        console.log("Created project instance:", project);

        if (req.files && req.files.length > 0) {
            const mediaPromises = req.files.map(file => new Promise((resolve, reject) => {
                console.log("Processing file:", file.originalname);
                const blob = bucket.file(Date.now().toString() + '-' + file.originalname);
                const blobStream = blob.createWriteStream({
                    metadata: {
                        contentType: file.mimetype,
                    },
                });

                blobStream.on('finish', async () => {
                    try {
                        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/workwonders-f537b.appspot.com/o/${encodeURIComponent(blob.name)}?alt=media`;
                        console.log("Generated public URL:", publicUrl);

                        const media = new Media({
                            type: file.mimetype.startsWith('image/') ? 'image' : 'video',
                            url: publicUrl,
                            title: file.originalname,
                            project: project._id,
                        });

                        await media.save();
                        console.log("Saved media:", media);
                        resolve(media._id);
                    } catch (err) {
                        console.error("Error saving media:", err);
                        reject(err);
                    }
                });

                blobStream.on('error', err => {
                    console.error("Error with blob stream:", err);
                    reject(err);
                });
                blobStream.end(file.buffer);
            }));

            const mediaIds = await Promise.all(mediaPromises);
            console.log("All media processed:", mediaIds);
            project.media = mediaIds;
        }

        await project.save();
        console.log("Saved project:", project);

        res.status(201).json({ message: "Successful", project });
    } catch (err) {
        console.error("Error creating project:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ Error: err.message });
        }
        res.status(500).json({ Error: 'An internal server error occurred', details: err.message });
    }
});

// Display project delete form on GET
exports.project_delete_get = asyncHandler(async (req, res, next) => {
    const projectId = req.params.id;

    try {

<<<<<<< HEAD
        // const project = await Project.findById(projectId);
        const project = await Project.findById(projectId).populate('media');
    
=======
        const project = await Project.findById(projectId);

>>>>>>> d891da3da602535339c7556c822f50bc9b6a5f75
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });

        }
<<<<<<< HEAD
        
=======

>>>>>>> d891da3da602535339c7556c822f50bc9b6a5f75
        res.json(project);
    } catch (err) {
        res.json(`Error: ${projectId} is not a valid project Id `);
    }
});


// Handle project delete on POST
exports.project_delete_post = asyncHandler(async (req, res, next) => {
        try {
            const projectId = req.params.id;
    
            // Find the project by ID
            const project = await Project.findById(projectId).populate('media');
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }
            try {

                // Loop through each media (video) associated with the project
                for (const video of project.media) {
                    // Loop through the URLs in each video to delete them from Firebase Storage
                    for (const url of video.url) {
                        const filePath = decodeURIComponent(url.split('/').pop());
                        await bucket.file(filePath).delete();
                    }
        
                    // Delete the video document from MongoDB
                    await Media.findByIdAndDelete(video._id);
                }
            } catch(err) {
                console.log(`Error: ${err}`)
            }
    
            // Finally, delete the project from MongoDB
            await Project.findByIdAndDelete(projectId);
    
            res.status(200).json({ message: 'Project and associated media deleted successfully' });
        } catch (error) {
            console.error('Error deleting project:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });
    // const projectId = req.params.id;

<<<<<<< HEAD
    // // Find the project and populate associated media
    // const project = await Project.findById(projectId).populate('media');

    // if (!project) {
    //     return res.status(404).json({ error: 'Project not found' });
    // }

    // try {
    //     // Iterate over each media associated with the project
    //     for (const media of project.media) {
    //         try {
    //             // Extract the file path from the Firebase URL
    //             const filePath = extractFilePathFromUrl(media.url);
    //             if (filePath) {
    //                 const file = bucket.file(filePath);
    //                 await file.delete();
    //                 console.log(`Successfully deleted file from Firebase Storage: ${media.url}`);
    //             } else {
    //                 console.error(`Failed to extract file path from URL: ${media.url}`);
    //             }

    //             // Delete the media document from MongoDB
    //             await Media.findByIdAndDelete(media._id);
    //             console.log(`Successfully deleted media document with ID: ${media._id}`);
    //         } catch (err) {
    //             console.error(`Failed to delete media with ID: ${media._id}`, err);
    //         }
    //     }

    //     // Delete the project itself
    //     await Project.findByIdAndDelete(projectId);
    //     console.log(`Successfully deleted project with ID: ${projectId}`);
    //     res.json({ message: 'Project and associated media successfully deleted', project });
    // } catch (err) {
    //     console.error('Error during project deletion process', err);
    //     next(err);
    // }
// });

// Helper function to extract the file path from the Firebase Storage URL
function extractFilePathFromUrl(url) {
    try {
        const decodedUrl = decodeURIComponent(url);
        const matches = decodedUrl.match(/\/o\/(.+)\?/);
        return matches ? matches[1] : null;
    } catch (error) {
        console.error('Error extracting file path from URL:', error);
        return null;
    }
}
=======
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
>>>>>>> d891da3da602535339c7556c822f50bc9b6a5f75


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