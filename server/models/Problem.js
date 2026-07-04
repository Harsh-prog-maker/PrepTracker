const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  platform: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Problem", problemSchema);