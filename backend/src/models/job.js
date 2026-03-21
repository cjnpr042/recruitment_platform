import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String, required: true },

    salary: { type: String },
    requirement: { type: String },

    jobType: {
      type: String,
      enum: ["full-time", "part-time", "remote"],
      default: "full-time",
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true },
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
