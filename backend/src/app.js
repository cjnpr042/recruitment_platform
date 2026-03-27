import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import candidateRouter from "./routes/candidateRoutes.js";
import recruiterRouter from "./routes/recruiterRoutes.js";
import jobRouter from "./routes/jobRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
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
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// public
const API_V1 = "/api/v1";
app.use(`${API_V1}/auth`, authRouter);

//profile
app.use(`${API_V1}/candidates`, candidateRouter);
app.use(`${API_V1}/recruiters`, recruiterRouter);

// job
app.use(`${API_V1}/jobs`, jobRouter);

// application
app.use(`${API_V1}/applications`, applicationRouter);

// admin
app.use("/api/v1/admin", adminRouter);

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
