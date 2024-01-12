const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const Reservation = require("../entities/reservations");
// File path for data.json
const dataFilePath = path.join(__dirname, "..", "server", "data.json");

// Helper function to read data from data.json
const readData = () => {
  const jsonData = fs.readFileSync(dataFilePath);
  return JSON.parse(jsonData);
};

// Helper function to write data to data.json
const writeData = (data) => {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(dataFilePath, jsonData);
};

const updateReservation = (
  reservations,
  reservationIndex,
  holidayAsObject,
  { contactName, phoneNumber }
) => {
  reservations[reservationIndex].contactName =
    contactName || data.reservations[reservationIndex].contactName;
  reservations[reservationIndex].phoneNumber =
    phoneNumber || data.reservations[reservationIndex].phoneNumber;
  reservations[reservationIndex].holiday = holidayAsObject;

  return reservations[reservationIndex];
};

// GET all reservations
router.get("/reservations", (req, res) => {
  const data = readData();
  res.json(data.reservations || []);
});

// GET a single reservation by id
router.get("/reservations/:id", (req, res) => {
  const data = readData();
  const reservation = data.reservations.find(
    (r) => r.id === parseInt(req.params.id)
  );
  if (reservation) {
    res.json(reservation);
  } else {
    res.status(404).send("Reservation not found");
  }
});

// POST a new location
router.post("/reservations", (req, res) => {
  let data = readData();
  let { contactName, phoneNumber, holiday } = req.body;

  let holidayAsObject = data.holidays.find((x) => x.id === parseInt(holiday));
  if (!holidayAsObject) {
    return res.status(404).send("Holiday not found");
  }

  let newReservation = {
    id: Date.now(),
    contactName,
    phoneNumber,
    holiday: holidayAsObject,
  };

  data.reservations.push(newReservation);
  writeData(data);
  res.status(201).json(newReservation);
});

// PUT to update a location
router.put("/reservations", (req, res) => {
  let data = readData();
  let { id, contactName, phoneNumber, holiday } = req.body;

  let reservationIndex = data.reservations.findIndex(
    (r) => r.id === parseInt(id)
  );
  if (reservationIndex === -1) {
    return res.status(404).send(`Reservation not found`);
  }

  let holidayAsObject = data.reservations[reservationIndex].holiday;

  if (holiday) {
    holidayAsObject = data.holidays.find((x) => x.id === parseInt(holiday));
    if (!holidayAsObject) {
      return res.status(404).send(`Holiday not found`);
    }
  }

  data.reservations[reservationIndex] = updateReservation(
    data.reservations,
    reservationIndex,
    holidayAsObject,
    { contactName, phoneNumber }
  );

  writeData(data);
  res.json(data.reservations[reservationIndex]);
});

router.get("/find-reservation", (req, res) => {
  let phoneNumber = req.query;
  let data = readData();
  let reservation = data.reservations.find(
    (x) => x.phoneNumber === phoneNumber
  );

  reservation
    ? res.json(reservation)
    : res.status(404).send(`Reservation not found`);
});

// DELETE a location
router.delete("/reservations/:id", (req, res) => {
  let data = readData();

  let reservationToDeleteIndex = data.reservations.findIndex(
    (x) => x.id === parseInt(req.params.id)
  );

  if (reservationToDeleteIndex > -1) {
    data.reservations.splice(reservationToDeleteIndex, 1);
    writeData(data);
    res.status(200).send(`Reservation was deleted`);
  } else {
    res.status(404).send(`Reservation not found`);
  }
});

module.exports = router;
