// db/fetchBills.js

const pool = require("./db"); // Import the database connection
require("dotenv").config();
const fetch = require("node-fetch");

// Function to fetch a single bill from the API
const fetchBillFromAPI = async (billName, year) => {
  try {
    const response = await fetch(
      `https://glen.le.utah.gov/bills/${year}GS/${billName}/${process.env.API_KEY}`,
      {
        headers: { "x-api-key": process.env.API_KEY },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch bill ${billName}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Function to fetch all bills from the bill_list table and update bill_data
const fetchAndUpdateBills = async () => {
  let errors = []; // Collect the bill names that failed to sync.
  let success = []; // Collect the bill names that successfully synced.
  let results = {};

  try {
    // Step 1: Clear the existing data in the bill_data table
    await pool.query("DELETE FROM bill_data");

    // Reset the bill_id sequence to start from 1
    await pool.query("ALTER SEQUENCE bill_data_id_seq RESTART WITH 1");
    console.log(
      "Cleared existing data in bill_data and reset bill_id sequence."
    );

    // Step 2: Get all bills and their years from bill_list
    const result = await pool.query("SELECT bill_name, year FROM bill_list");
    const bills = result.rows;

    if (bills.length === 0) {
      console.log("No bills found in bill_list.");
      return [];
    }

    for (const { bill_name, year } of bills) {
      console.log(`Fetching data for bill: ${bill_name} for year: ${year}`);

      // Fetch bill data from the API
      const billData = await fetchBillFromAPI(bill_name, year);

      if (billData) {
        try {
          // Insert or update the bill_data table
          await pool.query(
            `INSERT INTO bill_data (bill, version, shorttitle, sponsor, floorsponsor, generalprovisions, hilightedprovisions, monies, attorney, fiscalanalyst, lastaction, lastactionowner, lastactiontime, trackingid, subjects, codesections, agendas)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
             ON CONFLICT (bill) DO UPDATE SET
               version = $2,
               shorttitle = $3,
               sponsor = $4,
               floorsponsor = $5,
               generalprovisions = $6,
               hilightedprovisions = $7,
               monies = $8,
               attorney = $9,
               fiscalanalyst = $10,
               lastaction = $11,
               lastactionowner = $12,
               lastactiontime = $13,
               trackingid = $14,
               subjects = $15,
               codesections = $16,
               agendas = $17`,
            [
              billData.bill,
              billData.version,
              billData.shorttitle,
              billData.sponsor,
              billData.floorsponsor,
              billData.generalprovisions,
              billData.hilightedprovisions,
              billData.monies,
              billData.attorney,
              billData.fiscalanalyst,
              billData.lastaction,
              billData.lastactionowner,
              billData.lastactiontime,
              billData.trackingid,
              billData.subjects,
              billData.codesections,
              billData.agendas,
            ]
          );

          console.log(`Bill ${bill_name} updated successfully.`);
          success.push({ name: bill_name, year: year });
        } catch (dbError) {
          console.error(`Database error for bill ${bill_name}:`, dbError);
          errors.push({ name: bill_name, year: year });
        }
      } else {
        errors.push({ name: bill_name, year: year }); // Add to errors if the fetch failed
      }
    }
  } catch (error) {
    console.error("Error fetching or updating bills:", error);
  }
  console.log("Errors being returned from fetchAndUpdateBills:", errors);
  console.log("Successes being returned from fetchAndUpdateBills:", success);

  results = { errors: errors, success: success };
  console.log("Results from fetchAndUpdateBills:", results);
  return results; // Return the list of bills that could not be synced
};

module.exports = fetchAndUpdateBills;
