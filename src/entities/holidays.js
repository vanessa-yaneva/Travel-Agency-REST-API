class Holiday {
  constructor(id, title, startDate, duration, price, freeSlots, location) {
    this.id = id;
    this.title = title;
    this.startDate = startDate;
    this.duration = duration;
    this.price = price;
    this.freeSlots = freeSlots;
    this.location = {
      id: location.id,
      street: location.street,
      number: location.number,
      city: location.city,
      country: location.country,
    };
  }
}

module.exports = Holiday;
