const invModel = require("../models/inventory-model");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken"); // ✅ Required for JWT auth

const Util = {};

// ===== Navigation Builder =====
Util.getNav = async function () {
  try {
    let data = await invModel.getClassifications();

    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';

    data.forEach((row) => {
      list += "<li>";
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>";
      list += "</li>";
    });

    list += "</ul>";

    return list;
  } catch (error) {
    console.error("Error building nav:", error);
    throw error;
  }
};

// ===== Vehicle Detail Page Builder =====
Util.buildVehicleDetail = function (vehicle) {
  const price = vehicle.inv_price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const miles = vehicle.inv_miles.toLocaleString("en-US");

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
  `;
  return detail;
};

// ===== Vehicle Grid Builder =====
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li>';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

// ===== Error Handling Wrapper =====
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ===== Validation Rules for Classification =====
Util.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Classification name is required.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name must be alphanumeric without spaces or special characters."),
  ];
};

// ===== Validation Check for Classification =====
Util.checkClassificationData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("inventory/add-classification", {
      errors: errors.array(),
      classification_name: req.body.classification_name,
      title: "Add New Classification",
      nav: "",
    });
  }
  next();
};

// ===== Validation Rules for Inventory =====
Util.inventoryRules = () => {
  return [
    body("classification_id").isInt({ min: 1 }).withMessage("Please select a classification."),
    body("inv_make").trim().isLength({ min: 1 }).withMessage("Make is required."),
    body("inv_model").trim().isLength({ min: 1 }).withMessage("Model is required."),
    body("inv_year")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Please enter a valid year."),
    body("inv_description").trim().isLength({ min: 1 }).withMessage("Description is required."),
    body("inv_image").trim().isLength({ min: 1 }).withMessage("Image path is required."),
    body("inv_thumbnail").trim().isLength({ min: 1 }).withMessage("Thumbnail path is required."),
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive integer."),
    body("inv_color").trim().isLength({ min: 1 }).withMessage("Color is required."),
  ];
};

// ===== Validation Check for Inventory =====
Util.checkInventoryData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    invModel
      .getClassifications()
      .then((classifications) => {
        const classificationSelect = `<select id="classification_id" name="classification_id" required>
          <option value="">Choose a classification</option>
          ${classifications
            .map(
              (c) =>
                `<option value="${c.classification_id}" ${
                  c.classification_id == req.body.classification_id ? "selected" : ""
                }>${c.classification_name}</option>`
            )
            .join("")}
          </select>`;

        res.status(400).render("inventory/add-inventory", {
          errors: errors.array(),
          classificationSelect,
          title: "Add New Inventory",
          nav: "",
          inv_make: req.body.inv_make,
          inv_model: req.body.inv_model,
          inv_year: req.body.inv_year,
          inv_description: req.body.inv_description,
          inv_image: req.body.inv_image,
          inv_thumbnail: req.body.inv_thumbnail,
          inv_price: req.body.inv_price,
          inv_miles: req.body.inv_miles,
          inv_color: req.body.inv_color,
        });
      })
      .catch((error) => {
        console.error(error);
        next(error);
      });
    return;
  }
  next();
};

// ===== Classification Dropdown Builder =====
Util.buildClassificationList = async function (selectedId = 0) {
  let data = await invModel.getClassifications();
  let list = '<select id="classification_id" name="classification_id" required>';
  list += '<option value="">Choose a classification</option>';

  data.forEach((classification) => {
    list += `<option value="${classification.classification_id}"`;
    if (classification.classification_id === Number(selectedId)) {
      list += " selected";
    }
    list += `>${classification.classification_name}</option>`;
  });

  list += "</select>";
  return list;
};

// ===== JWT Authorization Middleware =====
Util.checkJWTToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.locals.loggedin = false;
    return next();
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
    if (err) {
      res.locals.loggedin = false;
      return next();
    }
    res.locals.loggedin = true;
    res.locals.accountData = accountData;
    next();
  });
};

// ===== Login Required Middleware =====
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    return next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

// ===== Multi-Role Access Middleware =====
Util.checkAccountTypes = (...allowedTypes) => {
  return (req, res, next) => {
    const account = res.locals.accountData;
    if (account && allowedTypes.includes(account.account_type)) {
      return next();
    } else {
      req.flash("notice", "You do not have permission to access this page.");
      return res.redirect("/account");
    }
  };
};

module.exports = Util;
