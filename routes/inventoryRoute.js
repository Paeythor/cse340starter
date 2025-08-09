const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");

// Inventory routes
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId));
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteView));
router.post("/delete", utilities.handleErrors(invController.deleteInventory));

router.get("/", utilities.handleErrors(invController.buildManagementView));
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post(
  "/add-classification",
  utilities.classificationRules(),
  utilities.checkClassificationData,
  utilities.handleErrors(invController.registerClassification)
);
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post(
  "/add",
  utilities.inventoryRules(),
  utilities.checkInventoryData,
  utilities.handleErrors(invController.registerInventory)
);

module.exports = router;
