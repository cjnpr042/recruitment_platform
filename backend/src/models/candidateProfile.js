import mongoose from "mongoose";

const candidateProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fullName: { type: String, default: "Người dùng mới", trim: true },
    professionalPosition: { type: String, default: "" },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Not Specified"],
      default: "Not Specified",
    },
    birthday: { type: Date, default: null },

    profileOverview: { type: String, default: "" },

    education: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    workHistory: {
      type: [String],
      default: [],
    },

    phone: { type: String, default: "" },
  },
  { timestamps: true },
);

const candidateProfile = mongoose.model(
  "CandidateProfile",
  candidateProfileSchema,
);
export default candidateProfile;
