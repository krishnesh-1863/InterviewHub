import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";

export const getDashboardStats = async (req, res) => {
  try {

    const totalProblems = await Problem.countDocuments();

    const totalSubmissions = await Submission.countDocuments({
      user: req.user._id,
    });

    const accepted = await Submission.countDocuments({
      user: req.user._id,
      status: "Accepted",
    });

    const wrong = await Submission.countDocuments({
      user: req.user._id,
      status: { $ne: "Accepted" },
    });

    const recentSubmissions = await Submission.find({
      user: req.user._id,
    })
      .populate("problem", "title slug difficulty")
      .sort({ createdAt: -1 })
      .limit(5);
    const languageStats = await Submission.aggregate([
  {
    $match: {
      user: req.user._id,
    },
  },
  {
    $group: {
      _id: "$language",
      value: {
        $sum: 1,
      },
    },
  },
]);
   const submissionTrend = await Submission.aggregate([
  {
    $match: {
      user: req.user._id,
    },
  },
  {
    $group: {
      _id: {
        $dateToString: {
          format: "%d-%m",
          date: "$createdAt",
        },
      },
      submissions: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      _id: 1,
    },
  },
]);
    res.status(200).json({
      success: true,
      data: {
        totalProblems,
        totalSubmissions,
        accepted,
        wrong,
        recentSubmissions,
        languageStats,
        submissionTrend
      },
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};