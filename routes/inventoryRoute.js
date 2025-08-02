const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/") // Needed for error handling

// Route to get inventory by classification ID (e.g., /inv/type/1)
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Route to show individual vehicle detail (e.g., /inv/detail/3)
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildByInventoryId)
)

// Route to show delete confirmation page
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.buildDeleteView)
)

// Route to perform the delete
router.post(
  "/delete",
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router
