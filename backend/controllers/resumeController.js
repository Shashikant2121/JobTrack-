import fs from "fs";
import { PDFParse } from "pdf-parse";

import User from "../models/User.js";
import ai from "../config/ai.js";

// ===============================
// Upload Resume
// ===============================
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Read PDF
    const fileBuffer = fs.readFileSync(req.file.path);

    // Extract text from PDF
    const parser = new PDFParse({
      data: fileBuffer,
    });

    const result = await parser.getText();

    await parser.destroy();

    const resumeText = result.text;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from resume",
      });
    }

    // Delete previous resume
    if (user.resume && fs.existsSync(user.resume)) {
      fs.unlinkSync(user.resume);
    }

    // Save new resume path
    user.resume = req.file.path;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: user.resume,
      textPreview: resumeText.substring(0, 500),
    });
  } catch (error) {
    console.error("Upload Resume Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Analyze Resume with Gemini
// ===============================
export const analyzeResume = async (req, res) => {
  try {
    // Find user
    const user = await User.findById(req.user._id);

    if (!user || !user.resume) {
      return res.status(404).json({
        success: false,
        message: "Please upload a resume first",
      });
    }

    // Read resume PDF
    const fileBuffer = fs.readFileSync(user.resume);

    // Extract text
    const parser = new PDFParse({
      data: fileBuffer,
    });

    const result = await parser.getText();

    await parser.destroy();

    const resumeText = result.text;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from resume",
      });
    }

    // ===============================
    // Gemini Prompt
    // ===============================

    const prompt = `
You are an expert technical recruiter.

Analyze the following resume for a junior
Full Stack / Frontend Developer position.

Return ONLY valid JSON.

Use exactly this structure:

{
  "score": 0,
  "summary": "",
  "skills": [],
  "missingSkills": [],
  "strengths": [],
  "improvements": []
}

Rules:

- score must be a number from 0 to 100
- summary should be a short professional summary
- skills should contain skills found in the resume
- missingSkills should contain useful skills missing for a junior developer
- strengths should contain 3 to 5 points
- improvements should contain 3 to 5 actionable suggestions

Resume:

${resumeText}
`;


    // Gemini API Call

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",

      contents: prompt,

      config: {
        responseMimeType: "application/json",
      },
    });

    // Gemini response text

    const responseText = response.text;

    if (!responseText) {
      return res.status(500).json({
        success: false,
        message: "Gemini returned an empty response",
      });
    }

    // Convert JSON string → JavaScript object

    let analysis;

    try {
      analysis = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Gemini JSON Parse Error:", parseError);
      console.error("Gemini Response:", responseText);

      return res.status(500).json({
        success: false,
        message: "Gemini returned invalid JSON",
      });
    }

    // Final Response
   
    res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Resume Analysis Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
