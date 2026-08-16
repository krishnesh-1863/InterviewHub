import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { getLeaderboard } from "../controllers/leaderboard.controller.js";

const router = express.Router();

router.get("/", protect, getLeaderboard);

export default router;