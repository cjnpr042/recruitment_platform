import express from "express";
import {
  applyJob,
  getMyApplications,
  getApplicationById,
  deleteApplication,
  getApplicationsByJob,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

// candidate
router.post("/", protect, authorize("candidate"), applyJob);

router.get("/me", protect, authorize("candidate"), getMyApplications);

router.get(
  "/:applicationId",
  protect,
  authorize("candidate"),
  getApplicationById,
);
router.delete(
  "/:applicationId",
  protect,
  authorize("candidate"),
  deleteApplication,
);

// recruiter
router.get(
  "/jobs/:jobId",
  protect,
  authorize("recruiter"),
  getApplicationsByJob,
);

router.patch(
  "/:applicationId/status",
  protect,
  authorize("recruiter"),
  updateApplicationStatus,
);

export default router;
