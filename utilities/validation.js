const { body, validationResult } = require("express-validator");

// Classification validation rules
function classificationRules() {
  return [
    body("classification_name")
      .trim()
      .notEmpty().withMessage("Classification name is required.")
      .matches(/^[A-Za-z0-9]+$/).withMessage("Classification name must not contain spaces or special characters."),
  ];
}

// Inventory validation rules
function inventoryRules() {
  return [
    body("classification_id")
      .notEmpty().withMessage("Classification is required."),
    body("inv_make")
      .trim()
      .notEmpty().withMessage("Make is required."),
    body("inv_model")
      .trim()
      .notEmpty().withMessage("Model is required."),
    body("inv_year")
      .notEmpty().withMessage("Year is required.")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage("Year must be a valid 4-digit number."),
    body("inv_description")
      .trim()
      .notEmpty().withMessage("Description is required."),
    body("inv_image")
      .trim()
      .notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail")
      .trim()
      .notEmpty().withMessage("Thumbnail path is required."),
    body("inv_price")
      .notEmpty().withMessage("Price is required.")
      .isFloat({ min: 0 }).withMessage("Price must be a positive number."),
    body("inv_miles")
      .notEmpty().withMessage("Miles is required.")
      .isInt({ min: 0 }).withMessage("Miles must be a positive integer."),
    body("inv_color")
      .trim()
      .notEmpty().withMessage("Color is required."),
  ];
}

// Middleware to check validation result and send errors back
function checkClassificationData(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Pass errors and submitted data back to the form for stickiness
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      errors: errors.array(),
      classification_name: req.body.classification_name,
      nav: req.nav, // assuming nav was attached by middleware
    });
  }
  next();
}

function checkInventoryData(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Get classifications again for dropdown stickiness
    const invModel = require("../models/inventory-model");
    invModel.getClassifications().then((classifications) => {
      const classificationSelect = utilities.buildClassificationSelect(
        classifications,
        req.body.classification_id
      );
      return res.render("inventory/add-inventory", {
        title: "Add New Inventory",
        errors: errors.array(),
        classificationSelect,
        inv_make: req.body.inv_make,
        inv_model: req.body.inv_model,
        inv_year: req.body.inv_year,
        inv_description: req.body.inv_description,
        inv_image: req.body.inv_image,
        inv_thumbnail: req.body.inv_thumbnail,
        inv_price: req.body.inv_price,
        inv_miles: req.body.inv_miles,
        inv_color: req.body.inv_color,
        nav: req.nav,
      });
    });
  } else {
    next();
  }
}

module.exports = {
  classificationRules,
  inventoryRules,
  checkClassificationData,
  checkInventoryData,
};
