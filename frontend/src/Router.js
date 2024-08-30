import * as React from "react";
import {
  createBrowserRouter
} from "react-router-dom";
import Home from "./views/Home";
import Contact from './views/Contact'
import About from './views/About'
import Admin from './views/Admin'
import Machine from './views/Machine'
import PasswordVerification from "./views/Test";

const router = createBrowserRouter([
  {
    path: '/',
    element: < Home />
  }, {
    path: "contact",
    element: < Contact />
  }, {
    path: "about",
    element: < About />
  },
  {
    path: "admin",
    element: < Admin />
  },
  {
    path: "project",
    element: < Machine />
  }
  ,
  {
    path: "test",
    element: <PasswordVerification />
  }
]);

export default router;