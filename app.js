import "./config/env.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import runRoutes from "./routes/run.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());

app.use(cookieParser());
console.log("FRONTEND_URL =", process.env.FRONTEND_URL);
// CORS should come BEFORE any routes
app.use(
  cors({
    origin:process.env.FRONTEND_URL ,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/run", runRoutes);
app.use("/api/submissions", submissionRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "InterviewHub API Running",
  });
});



app.use(errorHandler);

export default app;