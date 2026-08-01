import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";
import { runCode } from "../services/judge0.service.js";

export const submitSolution = async (req, res) => {
  try {
    const { problemId, sourceCode, languageId, language } = req.body;

    if (!problemId || !sourceCode || !languageId || !language) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    let verdict = "Accepted";
    let executionTime = "";
    let memory = 0;
    let stdout = "";
    let stderr = "";
    let compileOutput = "";

    for (const testCase of problem.testCases) {
      const result = await runCode(
        sourceCode,
        languageId,
        testCase.input
      );

      stdout = result.stdout ?? "";
      stderr = result.stderr ?? "";
      compileOutput = result.compile_output ?? "";
      executionTime = result.time ?? "";
      memory = result.memory ?? 0;

      const status = result.status?.description;

      if (status === "Compilation Error") {
        verdict = "Compilation Error";
        break;
      }

      if (
        status === "Runtime Error" ||
        status === "Time Limit Exceeded" ||
        status === "Memory Limit Exceeded"
      ) {
        verdict = status;
        break;
      }

      const actual = stdout.trim().replace(/\r\n/g, "\n");
      const expected = testCase.output.trim().replace(/\r\n/g, "\n");

      if (actual !== expected) {
        verdict = "Wrong Answer";
        break;
      }
    }

    const submission = await Submission.create({
      user: req.user._id,
      problem: problem._id,
      language,
      languageId,
      sourceCode,
      stdin: "",
      stdout,
      stderr,
      compileOutput,
      executionTime,
      memory,
      status: verdict,
    });

    return res.status(201).json({
      success: true,
      data: submission,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user._id,
    })
      .populate("problem", "title slug difficulty")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("problem", "title slug difficulty")
      .populate("user", "name email");

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getProblemSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user._id,
      problem: req.params.problemId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};