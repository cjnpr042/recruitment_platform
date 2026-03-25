import Application from "../models/application.js";
import Job from "../models/job.js";
import CandidateProfile from "../models/candidateProfile.js";
import mongoose from "mongoose";

// POST /applications
export const applyJobService = async (userId, { jobId, coverLetter }) => {
  // 1. Kiểm tra đầu vào tối thiểu
  if (!jobId) throw { message: "JobId is required", status: 400 };

  // 2. Kiểm tra Job tồn tại và lấy luôn recruiterId để check logic
  const job = await Job.findById(jobId);
  if (!job) throw { message: "Job not found", status: 404 };

  // 3. Rule: Job phải đang Open
  if (job.status !== "open") {
    throw {
      message: "This job is no longer accepting applications",
      status: 400,
    };
  }

  // 4. Rule: Không được tự ứng tuyển vào Job của mình
  if (job.recruiterId.toString() === userId.toString()) {
    throw { message: "Recruiters cannot apply to their own jobs", status: 400 };
  }

  // 5. Validate cover letter
  if (coverLetter && coverLetter.length > 2000) {
    throw { message: "Cover letter is too long (max 2000 chars)", status: 400 };
  }

  try {
    const application = await Application.create({
      jobId,
      candidateId: userId,
      coverLetter: coverLetter?.trim(), // Trim khoảng trắng dư thừa
    });

    return application;
  } catch (err) {
    // Rule: Chống trùng lặp (dựa trên unique index: jobId + candidateId)
    if (err.code === 11000) {
      throw {
        message: "You have already applied for this position",
        status: 400,
      };
    }
    throw err;
  }
};

// get applycation
export const getMyApplicationsService = async (userId, query = {}) => {
  // 1. Parse & sanitize query
  const pageNum = Math.max(1, Number(query.page) || 1);
  const limitNum = Math.max(1, Number(query.limit) || 10);
  const skip = (pageNum - 1) * limitNum;

  // 2. Query DB
  const apps = await Application.find({ candidateId: userId })
    .populate({
      path: "jobId",
      select: "title salary status recruiterId",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  // 3. Lọc job bị xóa
  const validApps = apps.filter((app) => app.jobId !== null);

  // 4. Đếm total (nên sync với filter nếu cần strict)
  const total = await Application.countDocuments({
    candidateId: userId,
  });

  return {
    data: validApps,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

// get application by id
export const getApplicationByIdService = async (userId, appId) => {
  const app = await Application.findById(appId).populate(
    "jobId",
    "title recruiterId",
  );

  if (!app) {
    throw { message: "Application not found", status: 404 };
  }

  // chỉ owner mới xem
  if (app.candidateId.toString() !== userId) {
    throw { message: "Forbidden", status: 403 };
  }

  return app;
};

// withdraw application

export const deleteApplicationService = async (userId, appId) => {
  const app = await Application.findById(appId);

  if (!app) {
    throw { message: "Application not found", status: 404 };
  }

  if (app.candidateId.toString() !== userId) {
    throw { message: "Forbidden", status: 403 };
  }

  if (app.status !== "pending") {
    throw { message: "Cannot delete processed application", status: 400 };
  }

  await app.deleteOne();
};

// recruiter

export const getApplicationsByJobService = async (
  userId,
  jobId,
  query = {},
) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 10);
  const skip = (page - 1) * limit;

  const { status, keyword } = query;

  // 1. Check job tồn tại
  const job = await Job.findById(jobId);
  if (!job) {
    throw { message: "Job not found", status: 404 };
  }

  // 2. Check ownership
  if (job.recruiterId.toString() !== userId.toString()) {
    throw { message: "Forbidden", status: 403 };
  }

  // 3. Build match stage
  const matchStage = {
    jobId: new mongoose.Types.ObjectId(jobId),
  };

  if (status) {
    matchStage.status = status;
  }

  // 4. Aggregation pipeline
  const pipeline = [
    { $match: matchStage },

    {
      $lookup: {
        from: "candidateprofiles", // đúng theo mongoose auto naming
        localField: "candidateId",
        foreignField: "userId",
        as: "profile",
      },
    },

    {
      $unwind: {
        path: "$profile",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  // 5. Search theo tên
  if (keyword) {
    pipeline.push({
      $match: {
        "profile.fullName": {
          $regex: keyword,
          $options: "i",
        },
      },
    });
  }

  // 6. Project data
  pipeline.push(
    {
      $project: {
        _id: 1,
        candidateId: 1,
        candidateName: {
          $ifNull: ["$profile.fullName", "Unknown"],
        },
        candidateSkills: "$profile.skills",
        candidatePosition: "$profile.professionalPosition",
        coverLetter: 1,
        status: 1,
        appliedAt: 1,
      },
    },
    { $sort: { appliedAt: -1 } },

    // 7. Pagination
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    },
  );

  const result = await Application.aggregate(pipeline);

  const data = result[0].data;
  const total = result[0].totalCount[0]?.count || 0;

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// update application

export const updateApplicationStatusService = async (userId, appId, status) => {
  const validStatus = ["pending", "reviewed", "accepted", "rejected"];
  if (!validStatus.includes(status)) {
    throw { message: "Invalid application status", status: 400 };
  }

  const app = await Application.findById(appId).populate("jobId");

  if (!app) {
    throw { message: "Application not found", status: 404 };
  }

  if (!app.jobId) {
    throw { message: "The associated job no longer exists", status: 400 };
  }

  // Ownership check
  if (app.jobId.recruiterId.toString() !== userId.toString()) {
    throw {
      message: "Access denied. You are not the recruiter for this job",
      status: 403,
    };
  }

  // Business logic: Cannot accept for a closed job
  if (app.jobId.status !== "open" && status === "accepted") {
    throw { message: "Cannot accept candidates for a closed job", status: 400 };
  }

  app.status = status;
  await app.save();

  return app;
};
