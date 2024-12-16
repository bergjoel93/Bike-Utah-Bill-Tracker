require("dotenv").config();
const { Pool } = require("pg");

// Database connection setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Railway-hosted databases
  },
});

const createTables = async () => {
  try {
    // Create bill_list table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bill_list (
        bill_id SERIAL PRIMARY KEY,
        bill_name VARCHAR(50) NOT NULL,
        year INT NOT NULL
      );
    `);
    console.log('Table "bill_list" created successfully.');

    // Create bill_data table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bill_data (
        id SERIAL PRIMARY KEY,
        bill VARCHAR(50) NOT NULL,
        version VARCHAR(50),
        shorttitle VARCHAR(255),
        sponsor VARCHAR(100),
        floorsponsor VARCHAR(100),
        generalprovisions TEXT,
        hilightedprovisions TEXT,
        monies TEXT,
        attorney VARCHAR(100),
        fiscalanalyst VARCHAR(100),
        lastaction VARCHAR(255),
        lastactionowner VARCHAR(255),
        lastactiontime TIMESTAMP,
        trackingid VARCHAR(50),
        subjects TEXT[],
        codesections TEXT[],
        agendas TEXT[]
      );
    `);
    console.log('Table "bill_data" created successfully.');

    // Create public_table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public_table (
        id SERIAL PRIMARY KEY,
        bill_number VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        sponsor VARCHAR(100),
        description TEXT,
        status VARCHAR(100),
        support VARCHAR(50)
      );
    `);
    console.log('Table "public_table" created successfully.');

    // End the pool connection
    await pool.end();
    console.log("All tables created successfully. Connection closed.");
  } catch (err) {
    console.error("Error creating tables:", err);
    process.exit(1);
  }
};

// Execute the createTables function
createTables();
