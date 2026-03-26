import User from "../models/user.js";
import Job from "../models/job.js";
import Application from "../models/application.js";
import mongoose from "mongoose";

/* ======================
   USER
====================== */

export const blockUserService = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw { message: "Invalid User ID format", status: 400 };
  }

  const user = await User.findById(userId);
  if (!user) {
    throw { message: "User not found", status: 404 };
  }

  if (user.role === "admin") {
    throw { message: "Cannot block an admin account", status: 400 };
  }

  user.isBlocked = true;
  await user.save();

  return {
    id: user._id,
    isBlocked: user.isBlocked,
  };
};

export const unblockUserService = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw { message: "Invalid User ID format", status: 400 };
  }

  const user = await User.findById(userId);
  if (!user) {
    throw { message: "User not found", status: 404 };
  }

  user.isBlocked = false;
  await user.save();

  return {
    id: user._id,
    isBlocked: user.isBlocked,
  };
};

export const getUsersService = async (query = {}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.role) filter.role = query.role;

  if (query.search) {
    filter.email = { $regex: query.search.slice(0, 50), $options: "i" };
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return {
    data: users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUserByIdService = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw { message: "Invalid User ID format", status: 400 };
  }

  const user = await User.findById(userId).select("-password").lean();
  if (!user) {
    throw { message: "User not found", status: 404 };
  }

  return user;
};

/* ======================
   JOB
====================== */

export const getJobsAdminService = async (query = {}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.status) filter.status = query.status;

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate("recruiterId", "email")
      .select("title status jobType createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Job.countDocuments(filter),
  ]);

  const formattedJobs = jobs.map((job) => ({
    id: job._id,
    title: job.title,
    status: job.status,
    jobType: job.jobType,
    postedAt: job.createdAt,
    recruiterEmail: job.recruiterId?.email || "N/A",
  }));

  return {
    data: formattedJobs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getJobByIdAdminService = async (jobId) => {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw { message: "Invalid Job ID format", status: 400 };
  }

  const job = await Job.findById(jobId).populate("recruiterId", "email").lean();

  if (!job) {
    throw { message: "Job not found", status: 404 };
  }

  return job;
};

export const deleteJobAdminService = async (jobId) => {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw { message: "Invalid Job ID format", status: 400 };
  }

  const job = await Job.findByIdAndDelete(jobId);
  if (!job) {
    throw { message: "Job not found", status: 404 };
  }

  await Application.deleteMany({ jobId });

  return { message: "Job deleted successfully" };
};

/* ======================
   DASHBOARD
====================== */

export const getDashboardService = async () => {
  const [userStats, jobStats, applicationCount] = await Promise.all([
    User.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          candidates: {
            $sum: { $cond: [{ $eq: ["$role", "candidate"] }, 1, 0] },
          },
          recruiters: {
            $sum: { $cond: [{ $eq: ["$role", "recruiter"] }, 1, 0] },
          },
          blocked: {
            $sum: {
              $cond: [{ $eq: ["$isBlocked", true] }, 1, 0],
            },
          },
        },
      },
    ]),
    Job.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          open: { $sum: { $cond: [{ $eq: ["$status", "open"] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] } },
        },
      },
    ]),
    Application.countDocuments(),
  ]);

  const u = userStats[0] || {
    total: 0,
    candidates: 0,
    recruiters: 0,
    blocked: 0,
  };

  const j = jobStats[0] || {
    total: 0,
    open: 0,
    closed: 0,
  };

  return {
    users: u,
    jobs: j,
    applications: {
      total: applicationCount,
    },
  };
};
