import mongoose from "mongoose";
import dotenv from "dotenv";

import Problem from "../models/Problem.js";
import User from "../models/User.js";

import problems from "../data/problems.json" with { type: "json" };

dotenv.config();

const seedProblems = async () => {
  try {
    // Connect MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Find admin user
    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
      throw new Error("Admin user not found");
    }

    console.log(`Admin found: ${admin.email}`);

    let inserted = 0;
    let skipped = 0;

    // Process every problem
    for (const problem of problems) {
      // Check if problem already exists
      const existingProblem = await Problem.findOne({
        title: problem.title,
      });

      // Skip duplicate
      if (existingProblem) {
        console.log(`Skipping duplicate: ${problem.title}`);
        skipped++;
        continue;
      }

      // Add admin as creator
      const problemData = {
        ...problem,
        createdBy: admin._id,
      };

      // Create problem
      await Problem.create(problemData);

      console.log(`Inserted: ${problem.title}`);

      inserted++;
    }

    console.log("\n----------------------------");
    console.log("Seeding completed");
    console.log("----------------------------");
    console.log(`Inserted : ${inserted}`);
    console.log(`Skipped  : ${skipped}`);
    console.log(`Total    : ${problems.length}`);
    console.log("----------------------------");

  } catch (error) {
    console.error("\nSeeding failed:");
    console.error(error);

  } finally {
    await mongoose.connection.close();

    console.log("MongoDB connection closed");
  }
};

seedProblems();