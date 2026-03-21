import mongoose from "mongoose";

const candidateProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fullName: { type: String, required: true },
    professionalPosition: { type: String },

    gender: { type: String, enum: ["Male", "Female", "Other"] },
    birthday: { type: Date },

    profileOverview: { type: String },

    education: [{ type: String }],
    skills: [{ type: String }],
    workHistory: [{ type: String }],

    phone: { type: String },
  },
  { timestamps: true },
);

const candidateProfile = mongoose.model(
  "CandidateProfile",
  candidateProfileSchema,
);
export default CandidateProfile;
