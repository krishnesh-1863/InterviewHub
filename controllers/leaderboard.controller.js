import Submission from "../models/Submission.js";

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Submission.aggregate([
      {
        $match: {
          status: "Accepted",
        },
      },

      {
        $group: {
          _id: {
            user: "$user",
            problem: "$problem",
          },
        },
      },

      {
        $group: {
          _id: "$_id.user",
          solved: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          solved: -1,
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          email: "$user.email",
          solved: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: leaderboard,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};
