import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
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

    languageId: {
        type: Number,
        required: true
    },
    
    language: {
        type: String,
        required: true
    },

    sourceCode: {
      type: String,
      required: true,
    },

    stdin: {
      type: String,
      default: "",
    },

    stdout: {
      type: String,
      default: "",
    },

    stderr: {
      type: String,
      default: "",
    },

    compileOutput: {
      type: String,
      default: "",
    },

    executionTime: {
      type: String,
      default: "",
    },

    memory: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Wrong Answer",
        "Compilation Error",
        "Runtime Error",
        "Time Limit Exceeded",
        "Memory Limit Exceeded",
        "Internal Error",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index({ user: 1, createdAt: -1 });
submissionSchema.index({ problem: 1 });
submissionSchema.index({ status: 1 });

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;