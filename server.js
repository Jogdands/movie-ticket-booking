const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ================= FIX CORS ================= */
app.use(cors());
app.use(express.json());

/* ================= DB ================= */
mongoose.connect("mongodb://localhost:27017/movieDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* ================= MOVIE MODEL ================= */
const Movie = mongoose.model("Movie", {
  title: String,
  genre: String,
  image: String,
  price: Number
});

/* ================= BOOKING MODEL ================= */
const Booking = mongoose.model("Booking", {
  username: String,
  movie: String,
  date: String,
  time: String,
  seats: [String],
  amount: Number,
  createdAt: { type: Date, default: Date.now }
});

/* ================= MOVIES ================= */

// ADD MOVIE
app.post("/api/movies", async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.json({ success: true, movie });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET MOVIES
app.get("/api/movies", async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

// DELETE MOVIE
app.delete("/api/movies/:id", async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

/* ================= BOOKINGS ================= */

// CREATE BOOKING
app.post("/api/bookings", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL BOOKINGS (ADMIN)
app.get("/api/bookings", async (req, res) => {
  const data = await Booking.find().sort({ createdAt: -1 });
  res.json(data);
});

/* ================= SERVER ================= */
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});