import mongoose from "mongoose";
import slugify from "slugify";

const exampleSchema = new mongoose.Schema(
  {
    input: String,
    output: String,
    explanation: String,
  },
  { _id: false }
);

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
    },

    output: {
      type: String,
      required: true,
    },

    hidden: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const starterCodeSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
    type: String,
    unique: true,
    required: true
    },

    description: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    tags: [
      {
        type: String,
      },
    ],

    constraints: [
      {
        type: String,
      },
    ],

    examples: [exampleSchema],

    starterCodes: [starterCodeSchema],

    testCases: [testCaseSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;