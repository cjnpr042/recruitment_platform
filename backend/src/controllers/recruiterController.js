import {
  upsertRecruiterProfileService,
  getMyRecruiterProfileService,
  getPublicRecruiterProfileService,
} from "../services/recruiterService.js";

//  recruiter
export const upsertProfile = async (req, res, next) => {
  try {
    const profile = await upsertRecruiterProfileService(
      req.user.userId,
      req.body,
    );

    res.json({
      message: "Profile saved",
      profile,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    const profile = await getMyRecruiterProfileService(req.user.userId);

    res.json({ profile });
  } catch (error) {
    next(error);
  }
};

// public
export const getPublicProfile = async (req, res, next) => {
  try {
    const profile = await getPublicRecruiterProfileService(req.params.userId);

    res.json({ profile });
  } catch (error) {
    next(error);
  }
};
