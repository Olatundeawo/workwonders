const express = require("express");
const router = express.Router();
// const validateProject = require("../validators/projectValidator");

// Require controller modules.
const category_controller = require("../controllers/category");
const project_controller = require("../controllers/project");
const user_controller = require("../controllers/user");
const validateProject = require("../validators/projectValidator");

/// CATERGORY ROUTES ///

// Get request for creating a category
router.get("/category/create", category_controller.category_create_get);

// POST request for creating a category
router.post("/category/create", category_controller.category_create_post);

// Get request to delete category
router.get("/category/:id/delete", category_controller.category_delete_get);

// Post request to delete category
router.post("/category/:id/delete", category_controller.category_delete_post);

// Get request to update category
router.get("/category/:id/update", category_controller.category_update_get);

// Post request to update category
router.post("/category/:id/update", category_controller.category_update_post);

// Get request for one category
router.get("/category/:id", category_controller.category_detail);

// Get request for all category
router.get("/categories", category_controller.category_list);

/// PROJECT ROUTE ///

// Get request for the home page
router.get("/", project_controller.index)

// Get request for creating project
router.get("/project/create", project_controller.project_create_get);

// Post request for creating project
router.post("/project/create", validateProject, project_controller.project_create_post);

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

// Get request for creating user
router.get("/user/create", user_controller.user_create_get);

// Post request for creating user
router.post("/user/create", user_controller.user_create_post);

// Get request to delete user
router.get("/user/:id/delete", user_controller.user_delete_get);

// Post request to delete user
router.post("/user/:id/delete", user_controller.user_delete_post);

// Get request to update user
router.get("/user/:id/update", user_controller.user_update_get);

// Post request to update user
router.post("/user/:id/update", user_controller.user_update_post);

// Get request for one user
router.get("/user/:id", user_controller.user_detail);

// Get request for all users
router.get("/users", user_controller.user_list);

module.exports = router;