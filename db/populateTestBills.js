//db/populateTestBills.js

const pool = require("./db"); // Import the database connection
require("dotenv").config();

const testBills = [
  { bill_name: "HB0001", year: 2024 },
  { bill_name: "HB0002", year: 2024 },
  { bill_name: "HB0003", year: 2024 },
  { bill_name: "HB0100", year: 2024 },
  { bill_name: "HB0101", year: 2024 },
  { bill_name: "HB0102", year: 2024 },
  { bill_name: "HB0103", year: 2024 },
];

// Function to insert test bills into the bill_list table
const populateTestBills = async () => {
  try {
    for (const bill of testBills) {
      await pool.query(
        "INSERT INTO bill_list (bill_name, year) VALUES ($1, $2) ON CONFLICT (bill_name) DO NOTHING",
        [bill.bill_name, bill.year]
      );
      console.log(`Inserted bill: ${bill.bill_name} (${bill.year})`);
    }
    console.log("Test bills inserted successfully.");
  } catch (error) {
    console.error("Error inserting test bills:", error);
  } finally {
    await pool.end(); // Close the database connection
    console.log("Database connection closed.");
  }
};

// Execute the function
populateTestBills();
