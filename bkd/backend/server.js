const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");

const Rating = require("./models/ratingModel");
const auth = require("./middleware/auth");

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.use(
  session({
    secret: "rating-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

/* ---------- DB ---------- */
mongoose
  .connect("mongodb://127.0.0.1:27017/demo")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

/* ---------- LOGIN ---------- */
app.post("/login", (req, res) => {
  req.session.userId = "65aaa111aaa111aaa111aaa1";
  res.json({ message: "Logged in successfully" });
});

/* ---------- SAVE RATINGS ---------- */
app.post("/ratings", auth, async (req, res) => {
  try {
    const { ratings } = req.body;

    const values = Object.values(ratings);
    const average = values.reduce((a, b) => a + b, 0) / values.length;

    const saved = await Rating.findOneAndUpdate(
      { user: req.session.userId },
      { ratings, average },
      { upsert: true, new: true }
    );

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* ---------- GET RATINGS ---------- */
app.get("/ratings", auth, async (req, res) => {
  const rating = await Rating.findOne({ user: req.session.userId });
  res.json(rating);
});

app.listen(5000, () =>
  console.log("🚀 Server running on port 5000")
);
