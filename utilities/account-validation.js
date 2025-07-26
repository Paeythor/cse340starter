const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

/* ******************************************
 *  Registration Data Validation Rules
 * **************************************** */
const registrationRules = [
  body("account_firstname")
    .trim()
    .notEmpty()
    .withMessage("First name is required."),

  body("account_lastname")
    .trim()
    .notEmpty()
    .withMessage("Last name is required."),

  body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (emailExists) {
        throw new Error("Email exists. Please log in or use a different email.")
      }
    }),

  body("account_password")
    .trim()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password must be at least 12 characters long and contain at least 1 lowercase, 1 uppercase, 1 number, and 1 special character.")
]

/* ******************************************
 *  Login Data Validation Rules
 * **************************************** */
const loginRules = [
  body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email is required."),

  body("account_password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
]

/* ******************************************
 *  Check data and return errors for registration
 * **************************************** */
const checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render("account/register", {
      errors: errors.array(),
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

/* ******************************************
 *  Check data and return errors for login
 * **************************************** */
const checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render("account/login", {
      errors: errors.array(),
      account_email,
    })
  }
  next()
}

/* ******************************************
 *  Export the modules
 * **************************************** */
module.exports = {
  registrationRules,
  loginRules,
  checkRegData,
  checkLoginData
}
