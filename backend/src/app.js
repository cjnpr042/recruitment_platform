import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
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

app.use("/api/v1/auth", authRouter);

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
