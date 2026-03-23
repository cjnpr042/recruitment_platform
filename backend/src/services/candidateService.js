import CandidateProfile from "../models/candidateProfile.js";

export const upsertProfileService = async (userId, data) => {
  const profile = await CandidateProfile.findOneAndUpdate(
    { userId },
    { ...data },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );

  return profile;
};

export const getMyProfileService = async (userId) => {
  const profile = await CandidateProfile.findOne({ userId });

  //   if (!profile) {
  //     throw {
  //       message: "Profile not found",
  //       status: 404,
  //     };
  //   }
  if (!profile) {
    return {
      userId,
      fullName: "Chưa cập nhật",
      skills: [],
      education: [],
      workHistory: [],
      isNewProfile: true, // Flag để Frontend biết và hiển thị nút "Tạo profile"
    };
  }
  return profile;
};

export const getPublicProfileService = async (userId) => {
  const profile = await CandidateProfile.findOne({ userId }).select("-__v");

  if (!profile) {
    throw {
      message: "Profile not found",
      status: 404,
    };
  }

  return profile;
};
