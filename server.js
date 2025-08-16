/*******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const cookieParser = require("cookie-parser") // ✅ NEW: for JWT cookies
require("dotenv").config()
const app = express()

// Routes and controllers
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute") // ✅ Inventory routes
const accountRoute = require("./routes/accountRoute") // ✅ Account routes

// Utilities
const utilities = require("./utilities/") // ✅ Required for middleware

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.use(express.static("public"))
app.set("layout", "./layouts/layout") // Not at views root

/* ***********************
 * Middleware
 *************************/
app.use(express.urlencoded({ extended: true })) // ✅ To handle form POST data
app.use(express.json()) // ✅ To handle JSON
app.use(cookieParser()) // ✅ Cookie parser for JWT
app.use(utilities.checkJWTToken) // ✅ JWT checker for every request

// ✅ Static route for general pages (like home, about, etc.)
app.use(static)

// ✅ Route for Home
app.get("/", baseController.buildHome)

// ✅ Use Inventory and Account Routes
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 3000
const host = process.env.HOST || 'localhost'

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`)
})
// app.use(static)
app.use("/inv", inventoryRoute)