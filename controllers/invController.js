const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}

invController.buildByInventoryId = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const data = await invModel.getInventoryById(inv_id)
        
    if (!vehicle) {
      // Vehicle not found, render error page or 404
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

module.exports = invController
