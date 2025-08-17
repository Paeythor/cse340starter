const pool = require("../database");

/**
 * Add a review to the database
 * @param {number} vehicleId 
 * @param {string} name 
 * @param {number} rating 
 * @param {string} comment 
 */
async function addReview(vehicleId, name, rating, comment) {
  try {
    const sql = `
      INSERT INTO reviews (vehicle_id, reviewer_name, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [vehicleId, name, rating, comment];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error("addReview error:", error);
    throw error;
  }
}

/**
 * Get all reviews for a specific vehicle
 * @param {number} vehicleId 
 */
async function getReviewsByVehicleId(vehicleId) {
  try {
    const sql = `
      SELECT reviewer_name, rating, comment, review_date
      FROM reviews
      WHERE vehicle_id = $1
      ORDER BY review_date DESC;
    `;
    const result = await pool.query(sql, [vehicleId]);
    return result.rows;
  } catch (error) {
    console.error("getReviewsByVehicleId error:", error);
    throw error;
  }
}

module.exports = {
  addReview,
  getReviewsByVehicleId,
};
