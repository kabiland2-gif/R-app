const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      unique: true,
    },
    ratings: {
      Cleanliness: Number,
      Rooms: Number,
      Service: Number,
      Location: Number,
    },
    average: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rating", ratingSchema);
