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

//TO ADD FAVOURITES
const toggleFavorite = async (req, res) => {
  try {
    const { activityId } = req.params;

    const activity = await Activity.findOne({
      _id: activityId,
      user: req.user._id,
    });

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    activity.isFavorite = !activity.isFavorite;

    await activity.save();

    res.status(200).json({
      message: "Favorite updated",
      activity,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

//TO DELETE ANY ACTIVITY
const deleteActivity = async (req, res) => {
  try {

    const { activityId } = req.params;

    const activity = await Activity.findOne({
      _id: activityId,
      user: req.user._id,
    });

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    await activity.deleteOne();

    res.status(200).json({
      message: "Activity deleted successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// UPDATE LABEL & NOTE
const updateActivityLabel = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { label, note } = req.body;

    const activity = await Activity.findOne({
      _id: activityId,
      user: req.user._id,
    });

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    activity.label = label;
    activity.note = note;

    await activity.save();

    res.status(200).json({
      message: "Label updated successfully",
      activity,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = { addActivity, getActivities, getStats, updateActivityLabel, toggleFavorite,
  deleteActivity,};