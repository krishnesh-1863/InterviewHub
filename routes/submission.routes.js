import express from "express";
import protect from "../middlewares/auth.middleware.js";
import {
  submitSolution,
  getMySubmissions,
  getSubmissionById,
  getProblemSubmissions,
} from "../controllers/submission.controller.js";

const router = express.Router();

router.post("/", protect, submitSolution);

router.get("/me", protect, getMySubmissions);

router.get("/problem/:problemId", protect, getProblemSubmissions);

router.get("/:id", protect, getSubmissionById);

export default router;