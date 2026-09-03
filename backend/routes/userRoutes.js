import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protect, getProfile);


export default router;
