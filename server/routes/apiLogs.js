import express from "express";
import pool from "../db/index.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get API logs for workspace
router.get("/workspace/:workspaceId", authenticateToken, async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { limit = 100, offset = 0 } = req.query;

    // Check workspace access
    const accessCheck = await pool.query(
      `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
      [workspaceId, req.user.userId],
    );

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ error: "Access denied to this workspace" });
    }

    const result = await pool.query(
      `SELECT id, user_id, workspace_id,
              request_url as "requestUrl", request_method as "requestMethod",
              response_status as "responseStatus", latency_ms as "latencyMs",
              timestamp
       FROM api_logs WHERE workspace_id = $1 ORDER BY timestamp DESC LIMIT $2 OFFSET $3`,
      [workspaceId, parseInt(limit), parseInt(offset)],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get API logs error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get API logs for user (personal logs across all workspaces)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const result = await pool.query(
      `SELECT id, user_id, workspace_id,
              request_url as "requestUrl", request_method as "requestMethod",
              response_status as "responseStatus", latency_ms as "latencyMs",
              timestamp
       FROM api_logs WHERE user_id = $1 ORDER BY timestamp DESC LIMIT $2 OFFSET $3`,
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
    const { requestUrl, requestMethod, responseStatus, latencyMs, workspaceId } = req.body;
    if (
      !requestUrl ||
      !requestMethod ||
      !responseStatus ||
      latencyMs === undefined ||
      !workspaceId
    ) {
      return res.status(400).json({ error: "All fields are required, including workspaceId" });
    }

    // Check workspace access
    const accessCheck = await pool.query(
      `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
      [workspaceId, req.user.userId],
    );

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ error: "Access denied to this workspace" });
    }

    const result = await pool.query(
      `INSERT INTO api_logs (user_id, workspace_id, request_url, request_method, response_status, latency_ms, timestamp) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
       RETURNING id, user_id, workspace_id,
                request_url as "requestUrl", request_method as "requestMethod",
                response_status as "responseStatus", latency_ms as "latencyMs",
                timestamp`,
      [req.user.userId, workspaceId, requestUrl, requestMethod, responseStatus, latencyMs],
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
    const { workspaceId } = req.query;
    
    let logsResult;
    if (workspaceId) {
      // Check workspace access
      const accessCheck = await pool.query(
        `SELECT role FROM workspace_members 
         WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
        [workspaceId, req.user.userId],
      );

      if (accessCheck.rows.length === 0) {
        return res.status(403).json({ error: "Access denied to this workspace" });
      }
      
      logsResult = await pool.query(
        `SELECT id, response_status, latency_ms
         FROM api_logs WHERE workspace_id = $1 ORDER BY timestamp DESC LIMIT 1000`,
        [workspaceId],
      );
    } else {
      logsResult = await pool.query(
        `SELECT id, response_status, latency_ms
         FROM api_logs WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 1000`,
        [req.user.userId],
      );
    }
    
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
