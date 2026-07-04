const mongoose = require("mongoose");
const Problem = require("../models/Problem");
const fs = require("fs");
const csv = require("csv-parser");
require("dotenv").config();

const problems = [];

async function seedProblems() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");

    fs.createReadStream("./seed/problems.csv")
      .pipe(csv())
      .on("data", (row) => {
        problems.push(row);
      })
      .on("end", async () => {
        await Problem.deleteMany();

        await Problem.insertMany(problems);

        console.log(`✅ ${problems.length} Problems Seeded Successfully`);

        process.exit();
      });

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedProblems();