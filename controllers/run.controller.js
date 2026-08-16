import { runCode } from "../services/judge0.service.js";

export const runCodeController = async (req, res) => {
  try {
    const { sourceCode, languageId, stdin } = req.body;

    if (!sourceCode || !languageId) {
      return res.status(400).json({
        success: false,
        message: "Source code and language id are required",
      });
    }

    const result = await runCode(
      sourceCode,
      languageId,
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
      message: error.message,
    });
  }
};