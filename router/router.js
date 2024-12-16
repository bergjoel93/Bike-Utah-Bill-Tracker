// router/router.js

const express = require("express");
const fetchAndUpdateBills = require("../db/fetchBills");

require("dotenv").config();

const router = express.Router();

const {
  renderAdminPage,
  updateBillList,
} = require("../controllers/adminController");
const { renderIndexPage } = require("../controllers/indexController");

//////////////// Get Routes ////////////////

// Home
// Route to render the index page

router.get("/", renderIndexPage);

// Route to admin page

router.get("/admin", renderAdminPage);

// Route to update bills

router.get("/admin/update-bills", async (req, res) => {
  try {
    await fetchAndUpdateBills();
    res.send("Bill data updated successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating bill data.");
  }
});

//////////////// Post Routes ////////////////

// Route to publish changes to the bill_list table
router.post("/admin/publish", updateBillList);

module.exports = router;
