const express = require("express");
const cors = require("cors");

// Initialize express app
const app = express();

// Use body-parser middleware to parse JSON requests
app.use(express.json());
app.use(cors());

const locationRouter = require("./src/controllers/locationController");
const holidayRouter = require("./src/controllers/holidayController");
const reservationRouter = require("./src/controllers/reservationController");
// Define routes
// Example: app.use('/api/holidays', require('./src/controllers/holidayController'));
app.use("/locations", locationRouter); // Use LocationController for '/api/locations' route
app.use("/holidays", holidayRouter);
app.use(reservationRouter);
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
