import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  uploadResume,
  analyzeResume,
} from "../controllers/resumeController.js";

const router = express.Router();

router.post("/upload", protect, upload.single("resume"), uploadResume);

router.post("/analyze", protect, analyzeResume);

export default router;
