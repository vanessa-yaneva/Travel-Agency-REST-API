const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

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

const updateHoliday = (
  holidays,
  holidayIndex,
  selectedLocationObject,
  body
) => {
  holidays[holidayIndex].title = body.title || holidays[holidayIndex].title;
  holidays[holidayIndex].startDate =
    body.startDate || holidays[holidayIndex].startDate;
  holidays[holidayIndex].duration =
    body.duration || holidays[holidayIndex].duration;
  holidays[holidayIndex].price = body.price || holidays[holidayIndex].price;
  holidays[holidayIndex].freeSlots =
    body.freeSlots || holidays[holidayIndex].freeSlots;
  holidays[holidayIndex].location =
    selectedLocationObject || holidays[holidayIndex].location;

  return holidays[holidayIndex];
};

const getFilteredHolidays = (query, holidays) => {
  if (query.location) {
    holidays = holidays.filter(
      (x) =>
        x.location.country.toLowerCase() === query.location.toLowerCase() ||
        x.location.city.toLowerCase() === query.location.toLowerCase()
    );
  }

  if (query.startDate) {
    holidays = holidays.filter(
      (h) => new Date(h.startDate) >= new Date(query.startDate)
    );
  }

  if (query.duration) {
    holidays = holidays.filter((h) => h.duration === parseInt(query.duration));
  }

  return holidays;
};
// GET all holidays
router.get("/", (req, res) => {
  let data = readData();

  let filteredHolidays = getFilteredHolidays(req.query, data.holidays);

  res.json(filteredHolidays);
});
// GET a single holiday by id
router.get("/:id", (req, res) => {
  const data = readData();
  const holiday = data.holidays.find((h) => h.id === parseInt(req.params.id));
  if (holiday) {
    res.json(holiday);
  } else {
    res.status(404).send("Holiday not found");
  }
});

// POST a new holiday
router.post("/", (req, res) => {
  let data = readData();

  let { title, startDate, duration, price, freeSlots, location } = req.body;

  let locationAsObject = data.locations.find(
    (x) => x.id === parseInt(location)
  );

  if (!locationAsObject) {
    return res
      .status(404)
      .send(`Location with ID: ${locationAsObject.id} not found`);
  }

  let newHoliday = {
    id: Date.now(),
    title,
    startDate,
    duration,
    price,
    freeSlots,
    location: locationAsObject,
  };

  data.holidays.push(newHoliday);
  writeData(data);
  res.status(201).json(newHoliday);
});

// PUT to update a holiday
router.put("/", (req, res) => {
  const data = readData();
  const { id, title, startDate, duration, price, freeSlots, location } =
    req.body;

  let holidayIndex = data.holidays.findIndex((x) => x.id === parseInt(id));

  if (holidayIndex === -1) {
    return res.status(404).send("Holiday not found");
  }

  let selectedLocationObject = data.locations.find(
    (x) => x.id === parseInt(location)
  );
  if (!selectedLocationObject) {
    return res.status(404).send(`Location not found for ID: ${location}`);
  }

  let body = { title, startDate, duration, price, freeSlots };

  data.holidays[holidayIndex] = updateHoliday(
    data.holidays,
    holidayIndex,
    selectedLocationObject,
    body
  );

  writeData(data);
  res.json(data.holidays[holidayIndex]);
});

// DELETE a holiday
router.delete("/:id", (req, res) => {
  const data = readData();
  const index = data.holidays.findIndex(
    (h) => h.id === parseInt(req.params.id)
  );
  if (index !== -1) {
    data.holidays.splice(index, 1);
    writeData(data);
    res.status(204).send();
  } else {
    res.status(404).send("Holiday not found");
  }
});

module.exports = router;
