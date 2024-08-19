import * as React from "react";
import {
  createBrowserRouter
} from "react-router-dom";
import Home from "./views/Home";
import Contact from './views/Contact'
import About from './views/About'

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
  }
]);

export default router;