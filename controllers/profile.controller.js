import User from "../models/User.js";
import Submission from "../models/Submission.js";

export const getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user._id)
      .select("-password");

    const submissions = await Submission.find({
  user: req.user._id,
}).populate("problem", "title");

    const accepted = submissions.filter(
      s => s.status === "Accepted"
    );

    const solved = new Set(
  accepted
    .filter(s => s.problem)
    .map(s => s.problem._id.toString())
);

    const accuracy =
      submissions.length === 0
        ? 0
        : (
            accepted.length /
            submissions.length *
            100
          ).toFixed(1);

    return res.status(200).json({

      success: true,

      data: {

        user,

        solved: solved.size,

        accepted: accepted.length,

        submissions: submissions.length,

        wrong:
          submissions.length -
          accepted.length,

        accuracy,

        recent:
  submissions
    .filter(s => s.problem)
    .slice(-5)
    .reverse(),

      },

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }

};