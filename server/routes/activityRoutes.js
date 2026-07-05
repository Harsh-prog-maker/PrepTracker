const express = require("express");
const router = express.Router();

const {
  addActivity,
  getActivities,
  getStats,
  updateActivityLabel,
  toggleFavorite,
  deleteActivity,
} = require("../controllers/activityController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, addActivity);

router.get("/", protect, getActivities);

router.get("/stats", protect, getStats);

// UPDATE LABEL
router.put("/:activityId/label", protect, updateActivityLabel);

// TOGGLE FAVORITE
router.put("/:activityId/favorite", protect, toggleFavorite);

// DELETE ACTIVITY
router.delete("/:activityId", protect, deleteActivity);

module.exports = router;