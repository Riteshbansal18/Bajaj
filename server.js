const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Groq = require("groq-sdk");

const {
  generateFibonacci,
  getPrimes,
  calculateLCM,
  calculateHCF
} = require("./utils/math");

const app = express();
app.use(express.json());
app.use(cors());

const EMAIL = "ritesh2510.be23@chitkara.edu.in";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});

app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;

    if (!body || Object.keys(body).length !== 1) {
      return sendError(res, 400, "Request must contain exactly one key");
    }

    const key = Object.keys(body)[0];
    const value = body[key];

    let result;

    switch (key) {
      case "fibonacci":
        if (typeof value !== "number" || value < 0)
          return sendError(res, 400, "Invalid fibonacci input");
        result = generateFibonacci(value);
        break;

      case "prime":
        if (!Array.isArray(value))
          return sendError(res, 400, "Prime input must be array");
        result = getPrimes(value);
        break;

      case "lcm":
        if (!Array.isArray(value))
          return sendError(res, 400, "LCM input must be array");
        result = calculateLCM(value);
        break;

      case "hcf":
        if (!Array.isArray(value))
          return sendError(res, 400, "HCF input must be array");
        result = calculateHCF(value);
        break;

      case "AI":
        if (typeof value !== "string")
          return sendError(res, 400, "AI input must be string");
        result = await getAIResponse(value);
        break;

      default:
        return sendError(res, 400, "Invalid key");
    }

    res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data: result
    });

  } catch (err) {
    res.status(500).json({
      is_success: false,
      official_email: EMAIL,
      error: "Internal server error"
    });
  }
});

function sendError(res, statusCode, message) {
  return res.status(statusCode).json({
    is_success: false,
    official_email: EMAIL,
    error: message
  });
}
async function getAIResponse(question) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Answer in one word only." },
        { role: "user", content: question }
      ],
      model: "llama-3.1-8b-instant"
    });

    const text = chatCompletion.choices[0].message.content;

    return text.trim().split(" ")[0];

  } catch (err) {
    console.log("Groq Full Error:", err.response?.data || err.message);
    return "Error";
  }
}


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
