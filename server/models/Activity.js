const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },

    solvedAt: {
      type: Date,
      default: Date.now,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },

    label: {
      type: String,
      enum: [
        "",
        "Need Revision",
        "Marked for Review",
        "Revised",
        "Interview Ready",
      ],
      default: "",
    },

    note: {
      type: String,
      maxlength: 250,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Activity", activitySchema);