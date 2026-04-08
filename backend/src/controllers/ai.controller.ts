import { Request, Response } from "express";
import { runGraph } from "../graph/langgraph";

export const handleAIQuery = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    // Validate input
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Query is required and must be a non-empty string" 
      });
    }

    const result = await runGraph(query.trim());

    // Validate result
    if (!result || !result.answer) {
      return res.status(500).json({
        success: false,
        error: "Failed to generate answer"
      });
    }

    res.json({
      success: true,
      source: result.source,
      data: result.answer,
    });
  } catch (error) {
    console.error("AI Query Error:", error);
    res.status(500).json({ 
      success: false,
      error: "Graph execution failed",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
};