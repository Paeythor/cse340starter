const reviewModel = require("../models/reviewModel");

const addReview = async (req, res) => {
  const { vehicleId, name, rating, comment } = req.body;
  try {
    await reviewModel.addReview(vehicleId, name, rating, comment);
    res.redirect(`/inventory/detail/${vehicleId}`);
  } catch (error) {
    console.error("Review error:", error);
    res.status(500).send("Error submitting review.");
  }
};

module.exports = { addReview };
