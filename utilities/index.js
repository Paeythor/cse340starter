const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  try {
    let data = await invModel.getClassifications() // assume this returns an array

    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'

    data.forEach((row) => {
      list += "<li>"
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
      list += "</li>"
    })

    list += "</ul>"

    return list
  } catch (error) {
    console.error("Error building nav:", error)
    throw error
  }
}


/* ****************************************
 * Builds vehicle detail HTML
 **************************************** */
Util.buildVehicleDetail = function (vehicle) {
  const price = vehicle.inv_price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })

  const miles = vehicle.inv_miles.toLocaleString("en-US")

  let detail = `
    <div class="vehicle-detail-container">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      <div class="vehicle-info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p><strong>Mileage:</strong> ${miles} miles</p>
      </div>
    </div>
  `
  return detail
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
