import { body } from "express-validator";

export const createProblemValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("difficulty")
    .isIn(["Easy", "Medium", "Hard"])
    .withMessage("Difficulty must be Easy, Medium or Hard"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array"),

  body("constraints")
    .optional()
    .isArray()
    .withMessage("Constraints must be an array"),

  body("examples")
    .isArray({ min: 1 })
    .withMessage("At least one example is required"),

  body("testCases")
    .isArray({ min: 1 })
    .withMessage("At least one test case is required"),

  body("starterCodes")
    .isArray({ min: 1 })
    .withMessage("At least one starter code is required"),
];