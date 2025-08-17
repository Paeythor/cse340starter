const invModel = require("../models/inventoryModel");

// Controller to build the home page
const buildHome = async (req, res) => {
  res.render("index", {
    title: "Home - CSE Motors",
    nav: await getNav(),
  });
};

// Controller to show inventory by classification (e.g., SUVs, trucks)
const buildByClassificationId = async (req, res) => {
  const classificationId = parseInt(req.params.classificationId);
  const data = await invModel.getInventoryByClassificationId(classificationId);
  const grid = buildClassificationGrid(data);

  let className = await invModel.getClassificationNameById(classificationId);

  res.render("inventory/classification", {
    title: `${className} Vehicles`,
    nav: await getNav(),
    grid,
  });
};

// Controller to show detailed view of one vehicle
const buildVehicleDetail = async (req, res) => {
  const vehicleId = parseInt(req.params.vehicleId);
  const data = await invModel.getVehicleById(vehicleId);
  const detail = buildVehicleDetailView(data);

  res.render("inventory/detail", {
    title: `${data.make} ${data.model}`,
    nav: await getNav(),
    detail,
  });
};

// Example utility functions (you’d build these in your utilities folder)
const getNav = require("../utilities/navBuilder");
const { buildClassificationGrid, buildVehicleDetailView } = require("../utilities/htmlBuilder");

// Export all controller functions
module.exports = {
  buildHome,
  buildByClassificationId,
  buildVehicleDetail,
};
