import express from "express";
import { handleAIQuery } from "../controllers/ai.controller";

const router = express.Router();

/**
 * POST /api/ai/query
 * Handles AI queries and returns answers with source information
 */
router.post("/query", handleAIQuery);

/**
 * GET /api/ai/health
 * Health check endpoint
 */
router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "AI service is running" });
});

export default router;
