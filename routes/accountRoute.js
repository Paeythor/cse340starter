const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")
const utilities = require("../utilities")

// Deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process login request
router.post(
  "/login",
  regValidate.loginRules,
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Deliver registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process registration request
router.post(
  "/register",
  regValidate.registrationRules,
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Deliver account management view after login
router.get("/", utilities.handleErrors(accountController.buildAccount))

module.exports = router
