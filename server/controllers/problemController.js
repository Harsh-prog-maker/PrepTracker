const Problem = require("../models/Problem");

// GET ALL PROBLEMS
const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find().sort({ title: 1 });

    res.status(200).json(problems);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getProblems,
};