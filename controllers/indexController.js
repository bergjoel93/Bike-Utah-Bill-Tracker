// controllers/indexController.js
const pool = require("../db/db");

// Render the index page with combined bill data
const renderIndexPage = async (req, res) => {
  try {
    const query = `
      SELECT 
        bd.bill,
        bd.shorttitle,
        bd.sponsor,
        bl.custom_description AS description,
        bd.lastaction AS status,
        bl.support,
        bd.lastactiontime AS updated
      FROM 
        bill_data bd
      JOIN 
        bill_list bl
      ON 
        bd.bill = bl.bill_name
    `;

    const result = await pool.query(query);
    res.render("index", { bills: result.rows });
  } catch (error) {
    console.error("Error fetching combined bill data:", error);
    res.status(500).send("Error fetching bill data");
  }
};

module.exports = {
  renderIndexPage,
};
