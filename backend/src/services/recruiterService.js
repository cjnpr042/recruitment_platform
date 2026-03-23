import RecruiterProfile from "../models/recuiterProfile.js";

export const upsertRecruiterProfileService = async (userId, data) => {
  const profile = await RecruiterProfile.findOneAndUpdate(
    { userId },
    { ...data },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );

  return profile;
};

export const getMyRecruiterProfileService = async (userId) => {
  const profile = await RecruiterProfile.findOne({ userId });

  if (!profile) {
    throw {
      message: "Profile not found",
      status: 404,
    };
  }

  return profile;
};

export const getPublicRecruiterProfileService = async (userId) => {
  const profile = await RecruiterProfile.findOne({ userId }).select("-__v");

  if (!profile) {
    throw {
      message: "Profile not found",
      status: 404,
    };
  }

  return profile;
};
