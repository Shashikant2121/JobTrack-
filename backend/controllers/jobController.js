import JobApplication from "../models/JobApplication.js";

// ========================================
// CREATE JOB APPLICATION
// ========================================
export const createJob = async (req, res) => {
  try {
    const {
      company,
      position,
      location,
      jobType,
      workMode,
      salary,
      status,
      appliedDate,
      interviewDate,
      jobUrl,
      notes,
    } = req.body;

    if (!company || !position) {
      return res.status(400).json({
        success: false,
        message: "Company and position are required",
      });
    }

    const job = await JobApplication.create({
      user: req.user._id,
      company,
      position,
      location,
      jobType,
      workMode,
      salary,
      status,
      appliedDate,
      interviewDate,
      jobUrl,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Job application added successfully",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET ALL JOB APPLICATIONS
// ========================================
export const getJobs = async (req, res) => {
  try {
    const jobs = await JobApplication.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get Jobs Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET SINGLE JOB APPLICATION
// ========================================
export const getJobById = async (req, res) => {
  try {
    const job = await JobApplication.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job application not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get Job By ID Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// UPDATE JOB APPLICATION
// ========================================
export const updateJob = async (req, res) => {
  try {
    const job = await JobApplication.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job application updated successfully",
      job,
    });
  } catch (error) {
    console.error("Update Job Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// DELETE JOB APPLICATION
// ========================================
export const deleteJob = async (req, res) => {
  try {
    const job = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job application deleted successfully",
    });
  } catch (error) {
    console.error("Delete Job Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET JOB APPLICATION STATISTICS
// ========================================
export const getJobStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total applications
    const totalApplications = await JobApplication.countDocuments({
      user: userId,
    });

    // Interview applications
    const interviews = await JobApplication.countDocuments({
      user: userId,
      status: "Interview",
    });

    // Offer applications
    const offers = await JobApplication.countDocuments({
      user: userId,
      status: "Offer",
    });

    // Rejected applications
    const rejections = await JobApplication.countDocuments({
      user: userId,
      status: "Rejected",
    });

    res.status(200).json({
      success: true,
      stats: {
        totalApplications,
        interviews,
        offers,
        rejections,
      },
    });
  } catch (error) {
    console.error("Get Job Stats Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET APPLICATION ANALYTICS
// ========================================
export const getJobAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await JobApplication.find({
      user: userId,
    }).sort({ createdAt: -1 });

    const totalApplications = applications.length;

    const statusCounts = {
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };

    applications.forEach((job) => {
      if (statusCounts[job.status] !== undefined) {
        statusCounts[job.status]++;
      }
    });

    const interviewRate =
      totalApplications > 0
        ? Math.round(
            (statusCounts.Interview / totalApplications) * 100
          )
        : 0;

    const offerRate =
      totalApplications > 0
        ? Math.round(
            (statusCounts.Offer / totalApplications) * 100
          )
        : 0;

    res.status(200).json({
      success: true,

      analytics: {
        totalApplications,
        statusCounts,
        interviewRate,
        offerRate,

        recentApplications: applications.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Get Job Analytics Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};