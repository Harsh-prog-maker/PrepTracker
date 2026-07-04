const Activity = require("../models/Activity");
const Problem = require("../models/Problem");

// ADD ACTIVITY
const addActivity = async (req, res) => {
  try {
    const { problemTitle } = req.body;

    const problem = await Problem.findOne({ title: problemTitle });

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    const existingActivity = await Activity.findOne({
  user: req.user._id,
  problem: problem._id,
});

if (existingActivity) {
  return res.status(400).json({
    message: "You have already solved this problem.",
  });
}
    const activity = await Activity.create({
      user: req.user._id,
      problem: problem._id,
    });

    res.status(201).json({
      message: "Activity created successfully",
      activity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// GET ALL ACTIVITIES
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
      user: req.user._id,
    }).populate("problem");

    res.status(200).json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// GET STATS
const getStats = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id }).populate("problem");

    const stats = {
      totalSolved: activities.length,
      easy: 0,
      medium: 0,
      hard: 0,
    };

    activities.forEach((activity) => {
      const difficulty = activity.problem.difficulty.toLowerCase();

      if (difficulty === "easy") stats.easy++;
      else if (difficulty === "medium") stats.medium++;
      else if (difficulty === "hard") stats.hard++;
    });

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addActivity, getActivities, getStats };