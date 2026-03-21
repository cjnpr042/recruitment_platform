import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  { timestamps: true },
);
const refreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
export default refreshToken;
