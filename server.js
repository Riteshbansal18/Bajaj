const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Groq = require("groq-sdk");

const math = require("./utils/math");

const app = express();
app.use(express.json());
app.use(cors());

const EMAIL = "your_official_chitkara_email@chitkara.edu.in";

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
  const body = req.body;

  if (!body || Object.keys(body).length !== 1) {
    return res.status(400).json({
      is_success: false,
      official_email: EMAIL,
      error: "Invalid request"
    });
  }

  const key = Object.keys(body)[0];
  const value = body[key];

  try {
    let output;

    if (key === "fibonacci") {
      if (typeof value !== "number" || value < 0)
        throw new Error("Invalid fibonacci input");

      output = math.generateFibonacci(value);
    }

    else if (key === "prime") {
      if (!Array.isArray(value))
        throw new Error("Invalid prime input");

      output = math.getPrimes(value);
    }

    else if (key === "lcm") {
      if (!Array.isArray(value))
        throw new Error("Invalid lcm input");

      output = math.calculateLCM(value);
    }

    else if (key === "hcf") {
      if (!Array.isArray(value))
        throw new Error("Invalid hcf input");

      output = math.calculateHCF(value);
    }

    else if (key === "AI") {
      if (typeof value !== "string")
        throw new Error("Invalid AI input");

      output = await askAI(value);
    }

    else {
      throw new Error("Invalid key");
    }

    res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data: output
    });

  } catch (err) {
    res.status(400).json({
      is_success: false,
      official_email: EMAIL,
      error: err.message
    });
  }
});

async function askAI(question) {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Give answer in one word only." },
        { role: "user", content: question }
      ],
      model: "llama-3.1-8b-instant"
    });

    const text = response.choices[0].message.content;
    return text.trim().split(" ")[0];

  } catch (err) {
    return "Error";
  }
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
