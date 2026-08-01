import Problem from "../models/Problem.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createProblem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    constraints,
    examples,
    starterCodes,
    testCases,
  } = req.body;

  const exists = await Problem.findOne({ title });

  if (exists) {
    throw new ApiError(409, "Problem already exists");
  }

  const problem = await Problem.create({
    title,
    description,
    difficulty,
    tags,
    constraints,
    examples,
    starterCodes,
    testCases,
    createdBy: req.user._id,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      "Problem created successfully",
      problem
    )
  );
});

export const getAllProblems = asyncHandler(async (req, res) => {
  const problems = await Problem.find()
    .select("title slug difficulty tags createdAt")
    .populate("createdBy", "name")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      "Problems fetched successfully",
      problems
    )
  );
});

export const getProblemBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const problem = await Problem.findOne({ slug }).populate(
    "createdBy",
    "name"
  );

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  const response = problem.toObject();

  response.testCases = response.testCases.filter(
    (testCase) => !testCase.isHidden
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Problem fetched successfully",
      response
    )
  );
});

export const updateProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findById(req.params.id);

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  const {
    title,
    description,
    difficulty,
    tags,
    constraints,
    examples,
    starterCodes,
    testCases,
  } = req.body;

  if (title !== undefined && title !== problem.title) {
    const exists = await Problem.findOne({ title });

    if (exists) {
      throw new ApiError(409, "Problem with this title already exists");
    }

    problem.title = title;
  }

  if (description !== undefined) problem.description = description;
  if (difficulty !== undefined) problem.difficulty = difficulty;
  if (tags !== undefined) problem.tags = tags;
  if (constraints !== undefined) problem.constraints = constraints;
  if (examples !== undefined) problem.examples = examples;
  if (starterCodes !== undefined) problem.starterCodes = starterCodes;
  if (testCases !== undefined) problem.testCases = testCases;

  await problem.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      "Problem updated successfully",
      problem
    )
  );
});

export const deleteProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findById(req.params.id);

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  await problem.deleteOne();

  return res.status(200).json(
    new ApiResponse(
      200,
      "Problem deleted successfully"
    )
  );
});