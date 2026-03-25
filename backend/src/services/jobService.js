import Job from "../models/job.js";
import mongoose from "mongoose";
// recruiter
// POST
export const createJobService = async (userId, data) => {
  const job = await Job.create({
    ...data,
    recruiterId: userId,
  });

  return job;
};

// GET my jobs
export const getMyJobsService = async (userId) => {
  return await Job.find({ recruiterId: userId }).sort({ createdAt: -1 });
};

// PUT
export const updateJobService = async (job, data) => {
  Object.assign(job, data);
  return await job.save();
};

// DELETE
export const deleteJobService = async (job) => {
  await job.deleteOne();
};
// update status
export const updateJobStatusService = async (job, status) => {
  job.status = status;
  return await job.save();
};

// public get
export const getJobsService = async (query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 10);
  const { keyword } = query;

  const match = { status: "open" };

  if (keyword) {
    match.title = { $regex: keyword, $options: "i" };
  }

  const result = await Job.aggregate([
    { $match: match },

    {
      $facet: {
        metadata: [{ $count: "total" }],

        data: [
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },

          // 🔥 lookup tối ưu (chỉ chạy sau khi paginate)
          {
            $lookup: {
              from: "recruiterprofiles",
              let: { recruiterUserId: "$recruiterId" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$userId", "$$recruiterUserId"],
                    },
                  },
                },
                {
                  $project: {
                    companyName: 1,
                    addresses: 1,
                  },
                },
              ],
              as: "company",
            },
          },

          {
            $unwind: {
              path: "$company",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $project: {
              title: 1,
              description: 1,
              salary: 1,
              jobType: 1,
              createdAt: 1,

              companyName: {
                $ifNull: ["$company.companyName", "N/A"],
              },

              companyAddress: {
                $ifNull: ["$company.addresses", []],
              },
            },
          },
        ],
      },
    },
  ]);

  const jobs = result[0].data;
  const total = result[0].metadata[0]?.total || 0;

  return {
    jobs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

// get singlejob
export const getSingleJobService = async (jobId) => {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return null;
  }
  const result = await Job.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(jobId),
        status: "open",
      },
    },

    {
      $lookup: {
        from: "recruiterprofiles",
        let: { recruiterUserId: "$recruiterId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$userId", "$$recruiterUserId"],
              },
            },
          },
          {
            $project: {
              companyName: 1,
              addresses: 1,
            },
          },
        ],
        as: "company",
      },
    },

    {
      $unwind: {
        path: "$company",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        title: 1,
        description: 1,
        salary: 1,
        requirement: 1,
        jobType: 1,
        status: 1,
        createdAt: 1,

        companyName: {
          $ifNull: ["$company.companyName", "N/A"],
        },

        companyAddress: {
          $ifNull: ["$company.addresses", []],
        },
      },
    },
  ]);

  return result[0] || null;
};
