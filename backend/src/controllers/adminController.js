import {
  blockUserService,
  unblockUserService,
  getUsersService,
  getUserByIdService,
  getJobsAdminService,
  getJobByIdAdminService,
  deleteJobAdminService,
  getDashboardService,
} from "../services/adminService.js";

/* USER */

export const blockUser = async (req, res, next) => {
  try {
    const data = await blockUserService(req.params.userId);
    res.json({ success: true, message: "User blocked", data });
  } catch (err) {
    next(err);
  }
};

export const unblockUser = async (req, res, next) => {
  try {
    const data = await unblockUserService(req.params.userId);
    res.json({ success: true, message: "User unblocked", data });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const result = await getUsersService(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.userId);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

/* JOB */

export const getJobsAdmin = async (req, res, next) => {
  try {
    const result = await getJobsAdminService(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const getJobByIdAdmin = async (req, res, next) => {
  try {
    const job = await getJobByIdAdminService(req.params.jobId);
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

export const deleteJobAdmin = async (req, res, next) => {
  try {
    const result = await deleteJobAdminService(req.params.jobId);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

/* DASHBOARD */

export const getDashboard = async (req, res, next) => {
  try {
    const data = await getDashboardService();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
