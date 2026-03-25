import {
  applyJobService,
  getMyApplicationsService,
  getApplicationByIdService,
  deleteApplicationService,
  getApplicationsByJobService,
  updateApplicationStatusService,
} from "../services/applicationService.js";

// POST
export const applyJob = async (req, res, next) => {
  try {
    const app = await applyJobService(req.user.userId, req.body);
    res.status(201).json({ application: app });
  } catch (err) {
    next(err);
  }
};

// GET my
export const getMyApplications = async (req, res, next) => {
  try {
    const apps = await getMyApplicationsService(req.user.userId, req.query);
    res.json(apps);
  } catch (err) {
    next(err);
  }
};

// GET detail
export const getApplicationById = async (req, res, next) => {
  try {
    const app = await getApplicationByIdService(
      req.user.userId,
      req.params.applicationId,
    );
    res.json({ application: app });
  } catch (err) {
    next(err);
  }
};

// DELETE
export const deleteApplication = async (req, res, next) => {
  try {
    await deleteApplicationService(req.user.userId, req.params.applicationId);
    res.json({ message: "Application withdrawn" });
  } catch (err) {
    next(err);
  }
};

// recruiter
export const getApplicationsByJob = async (req, res, next) => {
  try {
    const apps = await getApplicationsByJobService(
      req.user.userId,
      req.params.jobId,
      req.query,
    );
    res.json({ applications: apps });
  } catch (err) {
    next(err);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const app = await updateApplicationStatusService(
      req.user.userId,
      req.params.applicationId,
      req.body.status,
    );
    res.json({ application: app });
  } catch (err) {
    next(err);
  }
};
