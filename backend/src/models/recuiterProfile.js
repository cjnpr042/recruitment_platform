import mongoose from "mongoose";

const recruiterProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    companyName: {
      type: String,
      default: "Chưa cập nhật tên công ty",
      trim: true,
    },

    addresses: {
      type: [String],
      default: [],
    },

    websites: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);
const recruiterProfile = mongoose.model(
  "RecruiterProfile",
  recruiterProfileSchema,
);
export default recruiterProfile;
