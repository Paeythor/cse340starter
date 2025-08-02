const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/delete/:inv_id", invController.buildDeleteView);
module.exports = router;
router.post("/delete", invController.deleteInventory);

const inventoryRoute = require("./routes/inventoryRoute");
app.use("/inv", inventoryRoute);

