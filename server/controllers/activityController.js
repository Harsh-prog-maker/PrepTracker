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

// GET STREAK STATS
const getStreakStats = async (req, res) => {
  try {
    const activities = await Activity.find({
      user: req.user._id,
    }).sort({ solvedAt: 1 });

    // No activity yet
    if (activities.length === 0) {
      return res.status(200).json({
        currentStreak: 0,
        bestStreak: 0,
        showLastStreak: false,
        message: "Solve your first problem to begin your streak.",
      });
    }

    // Get unique solved dates
    const uniqueDates = [
      ...new Set(
        activities.map((activity) =>
          activity.solvedAt.toISOString().split("T")[0]
        )
      ),
    ];

    let currentStreak = 1;
    let bestStreak = 1;
    let lastStreak = 0;

    // Calculate best streak
    let streak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = new Date(uniqueDates[i - 1]);
      const curr = new Date(uniqueDates[i]);

      const diff =
        (curr - prev) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        streak++;
      } else {
        streak = 1;
      }

      bestStreak = Math.max(bestStreak, streak);
    }

    // Calculate current streak
    currentStreak = 1;

    for (
      let i = uniqueDates.length - 1;
      i > 0;
      i--
    ) {
      const curr = new Date(uniqueDates[i]);
      const prev = new Date(uniqueDates[i - 1]);

      const diff =
        (curr - prev) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Check if streak is still active
    const lastSolved = new Date(
      uniqueDates[uniqueDates.length - 1]
    );

    const today = new Date();

    today.setHours(0, 0, 0, 0);
    lastSolved.setHours(0, 0, 0, 0);

    const daysSinceLastSolve =
      (today - lastSolved) /
      (1000 * 60 * 60 * 24);

    let showLastStreak = false;
    let message = "";

    if (daysSinceLastSolve > 1) {
  showLastStreak = true;

  lastStreak = currentStreak;

  currentStreak = 0;

  message =
    "Start solving today to begin your new streak.";
}
 else if (currentStreak < bestStreak) {
      message = `${bestStreak - currentStreak} day${
        bestStreak - currentStreak > 1 ? "s" : ""
      } away from beating your personal record.`;
    } else if (
      currentStreak === bestStreak &&
      currentStreak !== 1
    ) {
      message =
        "You're tied with your personal best. One more day creates a new record!";
    } else if (currentStreak > bestStreak) {
      message = "🔥 Keep the momentum going!";
    }

    if (
      currentStreak === bestStreak &&
      currentStreak === uniqueDates.length &&
      currentStreak > 1
    ) {
      message = "🎉 New Personal Best! Keep the streak alive.";
    }

    res.status(200).json({
  currentStreak,
  lastStreak,
  bestStreak,
  showLastStreak,
  message,
});
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
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

module.exports = { addActivity, getActivities, getStats,getStreakStats, updateActivityLabel, toggleFavorite,
  deleteActivity,};