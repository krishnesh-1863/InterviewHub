import express from "express";
import {createProblem,getAllProblems,getProblemBySlug,updateProblem,deleteProblem} from "../controllers/problem.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validation.middleware.js";

import { createProblemValidator } from "../validators/problem.validator.js";
const router = express.Router();

router.post("/",protect,authorize("admin"),createProblemValidator,validate,createProblem);
router.get("/",protect,getAllProblems);
router.get("/:slug",protect,getProblemBySlug);
router.put("/:id",protect,authorize("admin"),updateProblem);
router.delete("/:id",protect,authorize("admin"),deleteProblem);
export default router;