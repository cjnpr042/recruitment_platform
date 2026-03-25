import {
  createJobService,
  getMyJobsService,
  updateJobService,
  deleteJobService,
  updateJobStatusService,
  getJobsService,
  getSingleJobService,
} from "../services/jobService.js";

export const createJob = async (req, res, next) => {
  try {
    const job = await createJobService(req.user.userId, req.body);
    res.status(201).json({ job });
  } catch (err) {
    next(err);
  }
};

// GET my jobs
export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await getMyJobsService(req.user.userId);
    res.json({ jobs });
  } catch (err) {
    next(err);
  }
};

// PUT
export const updateJob = async (req, res, next) => {
  try {
    const job = await updateJobService(req.job, req.body);
    res.json({ job });
  } catch (err) {
    next(err);
  }
};

// DELETE
export const deleteJob = async (req, res, next) => {
  try {
    await deleteJobService(req.job);
    res.json({ message: "Job deleted" });
  } catch (err) {
    next(err);
  }
};

// update status

export const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["open", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const job = await updateJobStatusService(req.job, status);

    res.json({ job });
  } catch (err) {
    next(err);
  }
};

// public job

export const getJobs = async (req, res, next) => {
  try {
    const result = await getJobsService(req.query);

    res.status(200).json({
      success: true,
      message: "Lấy danh sách job thành công",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// public single job
export const getSingleJob = async (req, res, next) => {
  try {
    const job = await getSingleJobService(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy job",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};
