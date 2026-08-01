import { runCode } from "../services/judge0.service.js";

export const runCodeController = async (req, res) => {
  try {
    const { source_code, language_id, stdin = "" } = req.body;

    if (!source_code || !language_id) {
      return res.status(400).json({
        success: false,
        message: "Source code and language_id are required",
      });
    }

    const result = await runCode(
      source_code,
      language_id,
      stdin
    );

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("Run Code Error:", error);

    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
};