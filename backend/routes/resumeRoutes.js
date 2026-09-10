import express from "express";
import multer from "multer";
import { readResume } from "../controllers/resumeController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage()
});

router.post("/read", upload.single("resume"), readResume);

export default router;