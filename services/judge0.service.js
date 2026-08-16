import axios from "axios";

export const runCode = async (sourceCode, languageId, stdin = "") => {
  try {
    console.log("STDIN:");
    console.log(stdin);
    const response = await axios.post(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: sourceCode,
        language_id: languageId,
        stdin,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    

    return response.data;
  } catch (error) {
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);

    throw new Error(
      error.response?.data?.error || error.message
    );
  }
};