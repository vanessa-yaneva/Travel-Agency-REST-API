const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const Location = require("../entities/locations");
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

// GET all locations
router.get("/", (req, res) => {
  const data = readData();
  res.json(data.locations || []);
});

// GET a single location by id
router.get("/:id", (req, res) => {
  const data = readData();
  const location = data.locations.find((l) => l.id === parseInt(req.params.id));
  if (location) {
    res.json(location);
  } else {
    res.status(404).send("Location not found");
  }
});

// POST a new location
router.post("/", (req, res) => {
  const data = readData();
  const newLocation = {
    id: Date.now(),
    ...req.body,
  };
  data.locations.push(newLocation);
  writeData(data);
  res.status(201).json(newLocation);
});

// PUT to update a location
router.put("/", (req, res) => {
  const data = readData();
  let { id, street, number, city, country } = req.body;
  const index = data.locations.findIndex((l) => l.id === parseInt(id));
  if (index !== -1) {
    data.locations[index] = new Location(id, street, number, city, country);
    writeData(data);
    res.json(data.locations[index]);
  } else {
    res.status(404).send("Location not found");
  }
});

// DELETE a location
router.delete("/:id", (req, res) => {
  const data = readData();
  const index = data.locations.findIndex(
    (l) => l.id === parseInt(req.params.id)
  );
  if (index !== -1) {
    data.locations.splice(index, 1);
    writeData(data);
    res.status(204).send();
  } else {
    res.status(404).send("Location not found");
  }
});

module.exports = router;
