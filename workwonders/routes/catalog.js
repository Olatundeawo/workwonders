const express = require("express");
const router = express.Router();
const project_controller = require("../controllers/project");
const user_controller = require("../controllers/user");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


/// PROJECT ROUTE ///

// Get request for creating project
router.get("/project/create", project_controller.project_create_get);

// Post request for creating project
router.post("/project/create", upload.array('media'),  project_controller.project_create_post);

// Get request to delete project
router.get("/project/:id/delete", project_controller.project_delete_get);

// Post request to delete project
router.post("/project/:id/delete", project_controller.project_delete_post);

// Get request to update project
router.get("/project/:id/update", project_controller.project_update_get);

// Post request to update project
router.post("/project/:id/update", project_controller.project_update_post);

// Get request for one project
router.get("/project/:id", project_controller.project_detail);

// Get request for all projects
router.get("/projects", project_controller.project_list);


/// USER ROUTE ///

// IPs allowed to access the sign up and login page 
const allowedIPs = ["192.168.43.5"];

//  Function that allowed certain IPs
const ipFilter = (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;

    if (allowedIPs.includes(clientIP)) {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Access denied"
        })
    }
}
// Get request for creating user
router.get("/user/create", ipFilter, user_controller.user_create_get);

// Post request for creating user
router.post("/user/create", ipFilter, user_controller.user_create_post);

// Get request to delete user
router.get("/user/:id/delete",ipFilter, user_controller.user_delete_get);

// Post request to delete user
router.post("/user/:id/delete", ipFilter, user_controller.user_delete_post);

// Get request to update user
router.get("/user/:id/update", ipFilter, user_controller.user_update_get);

// Post request to update user
router.post("/user/:id/update", ipFilter, user_controller.user_update_post);

// Get request for one user
router.get("/user/:id", ipFilter, user_controller.user_detail);

// Get request for all users
router.get("/users", ipFilter, user_controller.user_list);

module.exports = router;