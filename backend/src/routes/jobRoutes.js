import express from "express";
import {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  updateJobStatus,
  getJobs,
  getSingleJob,
} from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";
import { isJobOwner } from "../middleware/ownership.js";
const router = express.Router();

router.get("/me", protect, authorize("recruiter"), getMyJobs);
router.get("", protect, getJobs);
router.get("/:jobId", getSingleJob);
router.post("/", protect, authorize("recruiter"), createJob);
router.put("/:jobId", protect, authorize("recruiter"), isJobOwner, updateJob);
router.delete(
  "/:jobId",
  protect,
  authorize("recruiter"),
  isJobOwner,
  deleteJob,
);

router.patch(
  "/:jobId/status",
  protect,
  authorize("recruiter"),
  isJobOwner,
  updateJobStatus,
);

export default router;
