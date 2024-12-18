//controllers/adminController.js

const pool = require("../db/db");

const fetchAndUpdateBills = require("../db/fetchBills");

// Render the admin page with bill_list data
const renderAdminPage = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bill_list");
    res.render("admin", { bills: result.rows });
  } catch (error) {
    console.error("Error fetching bill list:", error);
    res.status(500).send("Error fetching bill list");
  }
};

// Handle form submission to update bill_list
const updateBillList = async (req, res) => {
  try {
    const { bill_name, year, custom_description, sponsorName, support } =
      req.body;

    console.log("Support:", support);

    // Clear the existing bill_list data
    await pool.query("DELETE FROM bill_list");
    // Reset the id sequence to 1
    await pool.query("ALTER SEQUENCE bill_list_bill_id_seq RESTART WITH 1");

    // Insert updated data
    for (let i = 0; i < bill_name.length; i++) {
      console.log("support value:", support[i]);
      await pool.query(
        "INSERT INTO bill_list (bill_name, year, custom_description, sponsorName, support) VALUES ($1, $2, $3, $4, $5)",
        [
          bill_name[i],
          year[i],
          custom_description[i] || null,
          sponsorName[i] || null,
          support[i] === "support",
        ]
      );
    }

    // resync bill list with bill_data
    const results = await fetchAndUpdateBills();
    // assign errors to the request body.
    req.body.results = results;
    //console.log("Request: ", req);

    // Re-render the admin page with errors if any
    res.render("results", { results });
  } catch (error) {
    console.error("Error updating bill list:", error);
    res.status(500).send("Error updating bill list");
  }
};

// Export the controller function
module.exports = {
  renderAdminPage,
  updateBillList,
};
