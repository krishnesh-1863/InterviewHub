import express from "express";
import { getSolvedProblems } from "../controllers/problem.controller.js";



import {
  createProblem,
  getAllProblems,
  getProblemBySlug,
  updateProblem,
  deleteProblem,
} from "../controllers/problem.controller.js";

import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import { createProblemValidator } from "../validators/problem.validator.js";

const router = express.Router();

// Admin
router.post(
  "/",
  protect,
  authorize("admin"),
  createProblemValidator,
  validate,
  createProblem
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  createProblemValidator,
  validate,
  updateProblem
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteProblem
);

// User
router.get("/", protect, getAllProblems);

router.get(
  "/solved",
  protect,
  getSolvedProblems
);

router.get("/:slug", protect, getProblemBySlug);

export default router;