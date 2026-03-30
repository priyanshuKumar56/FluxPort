import express from "express";
import pool from "../db/index.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get API logs for user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const result = await pool.query(
      "SELECT * FROM api_logs WHERE user_id = $1 ORDER BY timestamp DESC LIMIT $2 OFFSET $3",
      [req.user.userId, parseInt(limit), parseInt(offset)],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get API logs error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create API log
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { requestUrl, requestMethod, responseStatus, latencyMs } = req.body;
    if (
      !requestUrl ||
      !requestMethod ||
      !responseStatus ||
      latencyMs === undefined
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await pool.query(
      `INSERT INTO api_logs (id, user_id, request_url, request_method, response_status, latency_ms, timestamp) 
       VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [req.user.userId, requestUrl, requestMethod, responseStatus, latencyMs],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create API log error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get stats
router.get("/stats", authenticateToken, async (req, res) => {
  try {
    const logsResult = await pool.query(
      "SELECT * FROM api_logs WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 1000",
      [req.user.userId],
    );
    const logs = logsResult.rows;

    const stats = {
      totalRequests: logs.length,
      avgLatency: logs.length
        ? Math.round(
            logs.reduce((acc, curr) => acc + (curr.latency_ms || 0), 0) /
              logs.length,
          )
        : 0,
      errorRate: logs.length
        ? (
            (logs.filter((l) => l.response_status >= 400).length /
              logs.length) *
            100
          ).toFixed(1)
        : "0.0",
    };

    res.json(stats);
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
