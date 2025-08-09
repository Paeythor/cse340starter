const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invController = {}

invController.buildByInventoryId = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const data = await invModel.getInventoryById(inv_id)
    const vehicle = data    
    if (!vehicle) {
      const nav = await utilities.getNav()
      return res.status(404).render("errors/error", {
        title: "Vehicle Not Found",
        message: "Sorry, the vehicle you requested does not exist.",
        nav,
      })
    }
    const nav = await utilities.getNav()
    const vehicleHtml = utilities.buildVehicleDetail(vehicle)
    res.render("inventory/detail", {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleHtml,
    })
  } catch (error) {
    next(error)
  }
}

invController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  const nav = await utilities.getNav()
  const className = data.length > 0 ? data[0].classification_name : "No Vehicles"
  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invController.buildManagementView = async function (req, res) {
  const nav = await utilities.getNav()
  const message = req.flash("message")
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    message,
  })
}

invController.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

invController.registerClassification = async function (req, res) {
  const { classification_name } = req.body
  const nav = await utilities.getNav()

  const result = await invModel.addClassification(classification_name)
  if (result) {
    req.flash("message", "Classification added successfully.")
    res.redirect("/inv")
  } else {
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: [{ msg: "Failed to add classification." }],
    })
  }
}

invController.buildAddInventory = async function (req, res) {
  const nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationSelect,
    errors: null,
  })
}

invController.registerInventory = async function (req, res) {
  const nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList(
    req.body.classification_id
  )

  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body

  const result = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  )

  if (result) {
    req.flash("message", "Inventory item added successfully.")
    res.redirect("/inv")
  } else {
    res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationSelect,
      errors: [{ msg: "Failed to add inventory item." }],
      ...req.body,
    })
  }
}

module.exports = invController
