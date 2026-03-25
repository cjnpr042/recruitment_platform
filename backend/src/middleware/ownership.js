import Job from "../models/job.js";
import mongoose from "mongoose";

export const isJobOwner = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid Job ID format" });
    }
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiterId.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not the owner of this job",
      });
    }

    req.job = job;
    next();
  } catch (error) {
    next(error);
  }
};
