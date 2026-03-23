import Job from "../models/job.js";

export const isJobOwner = async (req, res, next) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiterId.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not the owner of this job",
      });
    }

    req.job = job; // optional
    next();
  } catch (error) {
    next(error);
  }
};
