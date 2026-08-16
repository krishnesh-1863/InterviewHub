import express from "express";

import protect from "../middlewares/auth.middleware.js";

import { getProfile } from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/", protect, getProfile);

export default router;