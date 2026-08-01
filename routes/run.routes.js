import express from "express";
import { runCodeController } from "../controllers/run.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, runCodeController);

export default router; 