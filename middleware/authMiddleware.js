const bcrypt = require("bcrypt");

// Middleware to protect the admin route
const checkAdminPassword = async (req, res, next) => {
  const inputPassword = req.body.password; // Get password from user input
  const storedHash = process.env.PASSWORD;

  if (!inputPassword) {
    return res.status(401).send("Password is required");
  }

  try {
    const match = await bcrypt.compare(inputPassword, storedHash);
    if (match) {
      next(); // Password is correct, proceed to the admin page
    } else {
      res.status(401).send("Incorrect password");
    }
  } catch (error) {
    console.error("Error during password comparison:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = checkAdminPassword;
