// blog_app/models/article.js
const mongoose = require("mongoose");

const URLSchema = new mongoose.Schema({
  originalURL: {
    type: String,
    required: true
  },
  shortURL: {
    type: String,
    required: true,
    unique: true
  },
  clickCount: {
    type: Number,
    required: true,
  },
  date: { type: Date, default: Date.now },
});

const URLModel = mongoose.model("Url", URLSchema);
module.exports = URLModel;