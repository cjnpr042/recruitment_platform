import mongoose from "mongoose";

const recruiterProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    companyName: { type: String, required: true },

    addresses: [{ type: String }],
    websites: [{ type: String }],

    description: { type: String },
  },
  { timestamps: true },
);
const recuiterProfile = mongoose.model(
  "RecruiterProfile",
  recruiterProfileSchema,
);
