// app.js
require("dotenv").config();
const express = require("express");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 3000;

// import router
const router = require("./router/router.js");

// Set the EJS as the template engine
app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static("public"));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", router);

// Schedule the fetch every 2 hours
cron.schedule("0 */2 * * *", () => {
  console.log("Running scheduled bill data fetch...");
  fetchAndUpdateBills();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
