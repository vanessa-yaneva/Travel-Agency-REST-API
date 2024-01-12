const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const locationRouter = require("./src/controllers/locationController");
const holidayRouter = require("./src/controllers/holidayController");
const reservationRouter = require("./src/controllers/reservationController");

// Define routes
app.use("/locations", locationRouter);
app.use("/holidays", holidayRouter);
app.use(reservationRouter);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
