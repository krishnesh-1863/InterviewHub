import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { register,login,logout,getMe } from "../controllers/auth.controller.js";

import validate from "../middlewares/validation.middleware.js";

import { registerValidator,loginValidator } from "../validators/auth.validator.js";

const router = express.Router();

router.post(
  "/register",
  registerValidator,
  validate,
  register
);
router.post("/login", loginValidator, validate, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;