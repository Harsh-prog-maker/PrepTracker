const express = require("express");
const router = express.Router();

const { addActivity, getActivities, getStats } = require("../controllers/activityController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, addActivity);
router.get("/stats", protect, getStats);
router.get("/", protect, getActivities);

module.exports = router;