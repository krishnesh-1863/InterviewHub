import Problem from "../models/Problem.js";
import slugify from "slugify";
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
        testCases
    } = req.body;

    const exists = await Problem.findOne({ title });

    if (exists) {
        throw new ApiError(409, "Problem already exists");
    }
    const slug = slugify(title, {
    lower: true,
    strict: true,
    });

    const problem = await Problem.create({
        title,
        slug,
        description,
        difficulty,
        tags,
        constraints,
        examples,
        starterCodes,
        testCases,
        createdBy: req.user._id
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
        .select(
            "title slug difficulty tags createdAt"
        )
        .populate(
            "createdBy",
            "name"
        )
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

    const problem = await Problem.findOne({ slug })
        .populate("createdBy", "name");

    if (!problem) {
        throw new ApiError(404, "Problem not found");
    }

    // Hide hidden test cases
    const visibleTestCases = problem.testCases.filter(
        (testCase) => !testCase.hidden
    );

    const response = {
        ...problem.toObject(),
        testCases: visibleTestCases,
    };

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

    if (title) {
        problem.title = title;
        problem.slug = slugify(title, {
            lower: true,
            strict: true,
        });
    }

    if (description) problem.description = description;
    if (difficulty) problem.difficulty = difficulty;
    if (tags) problem.tags = tags;
    if (constraints) problem.constraints = constraints;
    if (examples) problem.examples = examples;
    if (starterCodes) problem.starterCodes = starterCodes;
    if (testCases) problem.testCases = testCases;

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