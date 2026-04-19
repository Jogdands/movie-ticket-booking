const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  username: String,
  movie: String,
  date: String,
  time: String,
  seats: [String]
});

module.exports = mongoose.model("Booking", bookingSchema);