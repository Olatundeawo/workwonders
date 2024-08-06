#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Project = require("./models/project");
const Category = require("./models/category");
const User = require("./models/user");

const projects = [];
const categorys = [];
const users = [];

const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect(mongoDB);
    await createProject();
    await createUser();
    await createCategory();
    mongoose.connection.close();
}

async function userCreate(index, name, email, password, role, bio, project, profilePicture) {
    const userDetails = {name: name, email: email, password: password, role: role, bio: bio};
    if (project != false) userDetails.project = project
    if (profilePicture != false) userDetails.project = profilePicture

    const user = new User(userDetails);
    await user.save();
    users[index] = user
}

async function projectCreate(index, title, description, startDate, endDate, status, category) {
    const projectDeatils= {
        title: title, description: description
    }
    if (startDate != false) projectDeatils.startDate = startDate;
    if (endDate != false) projectDeatils.endDate = endDate;
    if (status != false) projectDeatils.status = status;
    if (category != false) projectDeatils.category = category;
    
    const project = new Project(projectDeatils);
    await project.save();
    projects[index] = project;
    
}

async function categoryCreate(index, name, description, project) {
    const categoryDetails = {
        name: name, description: description
    }
    if (project != false) categoryDetails.project = project;

    const category = new Category(categoryDetails);
    await category.save();
    categorys[index] = category;
}


async function createProject() {
    await Promise.all([
        projectCreate(0, 'testing', 'testing to know maybe it works'),
        projectCreate(1, 'checkong', 'checking the work'),
        projectCreate(2, 'testing23', 'testing to know maybe it works'),
        projectCreate(3, 'testing12', 'testing to know maybe it works'),
        
    ]);
}

async function createUser() {
    await Promise.all([
        userCreate(0, 'tunde', 'tunde@gmail', '1234', 'developer', 'software engineer'),
        userCreate(1, 'sola', 'sola@gmail', '124', 'observer', 'engineer'),
        userCreate(2, 'kayode', 'kay@gmail', '123445', 'tester', 'software engineer'),
        userCreate(3, 'titi', 'titi@gmail', '156u234', 'observer', 'business'),
        userCreate(4, 'samson', 'samson@gmail', '1234574v', 'user', 'desinger'),
    ]);
}

async function createCategories() {
    await Promise.all([
        categoryCreate(0, 'start', 'starting'),
        categoryCreate(1, 'work', 'working'),
        categoryCreate(2, 'end', 'ending'),
    ]);
}