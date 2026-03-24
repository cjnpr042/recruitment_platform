import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import candidateRouter from "./routes/candidateRoutes.js";
import recruiterRouter from "./routes/recruiterRoutes.js";
import jobRouter from "./routes/jobRoutes.js";
import cookieParser from "cookie-parser";

const app = express();
// middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
// public
app.use("/api/v1/auth", authRouter);
// thêm số nhiều sau v1
//private
app.use("/api/v1/candidate", candidateRouter);
app.use("/api/v1/recruiter", recruiterRouter);

// job
app.use("/api/v1/job", jobRouter);

//heal check
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

// not found
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});
export default app;
