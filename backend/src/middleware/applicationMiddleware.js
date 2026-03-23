export const canAccessApplication = async (req, res, next) => {
  try {
    const appId = req.params.id;
    const application = await Application.findById(appId).populate("jobId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const user = req.user;

    //candidate
    if (user.role === "candidate") {
      if (application.candidateId.toString() !== user.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    // recruiter
    if (user.role === "recruiter") {
      if (application.jobId.recruiterId.toString() !== user.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    //  admin →  pass

    req.application = application;
    next();
  } catch (error) {
    next(error);
  }
};
