import express from "express";
import { runSubmission } from "../controllers/submission.controller.js";

const router = express.Router();

router.post("/run", runSubmission);

export default router;