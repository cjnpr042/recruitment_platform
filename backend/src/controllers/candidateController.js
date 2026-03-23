import {
  upsertProfileService,
  getMyProfileService,
  getPublicProfileService,
} from "../services/candidateService.js";

//  candidate
export const upsertProfile = async (req, res, next) => {
  try {
    const profile = await upsertProfileService(req.user.userId, req.body);

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
    const profile = await getMyProfileService(req.user.userId);

    res.json({ profile });
  } catch (error) {
    next(error);
  }
};

//  public
export const getPublicProfile = async (req, res, next) => {
  try {
    const profile = await getPublicProfileService(req.params.userId);

    res.json({ profile });
  } catch (error) {
    next(error);
  }
};
