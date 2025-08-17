/*******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

// Utilities
const utilities = require("./utilities");

// Middleware to build navigation and set it as a local variable for all views
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav();
    next();
  } catch (error) {
    next(error);
  }
});

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Middleware
 *************************/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ✅ Static Files
app.use(express.static("public"));

// ✅ JWT Middleware
app.use(utilities.checkJWTToken);

// Controllers and Routes
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const reviewRoute = require("./routes/reviewRoute"); // <-- Require reviewRoute here

// ✅ Home route
app.get("/", baseController.buildHome);

// ✅ Feature routes
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);
app.use("/reviews", reviewRoute); // <-- Register reviewRoute BEFORE app.listen

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

/* ***********************
 * Server Start
 *************************/
app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});
