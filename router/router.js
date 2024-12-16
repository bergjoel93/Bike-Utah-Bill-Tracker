// router/router.js

const express = require("express");
const fetchAndUpdateBills = require("../db/fetchBills");

require("dotenv").config();
const checkAdminPassword = require("../middleware/authMiddleware");
const bcrypt = require("bcrypt");

const router = express.Router();

const {
  renderAdminPage,
  updateBillList,
} = require("../controllers/adminController");
const { renderIndexPage } = require("../controllers/indexController");

//////////////// Get Routes ////////////////

// Home
router.get("/", renderIndexPage);

// Route to show the login form
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// Route to render the admin page (protected)
router.get("/admin", (req, res) => {
  if (req.session.isAuthenticated) {
    renderAdminPage(req, res);
  } else {
    res.redirect("/login");
  }
});

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

// Route to handle login form submission
router.post("/login", async (req, res) => {
  const { password } = req.body;
  const storedHash = process.env.PASSWORD;

  try {
    const match = await bcrypt.compare(password, storedHash);
    if (match) {
      req.session.isAuthenticated = true;
      res.redirect("/admin");
    } else {
      res.render("login", { error: "Incorrect password. Please try again." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal server error");
  }
});

// Route to handle logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.redirect("/login");
  });
});

// Route to publish changes to the bill_list table
router.post("/admin/publish", updateBillList);

module.exports = router;
