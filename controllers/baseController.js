const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("index", {
      title: "Home",
      nav
    })
  } catch (error) {
    next(error) // pass errors to Express error handler
  }
}

module.exports = baseController
