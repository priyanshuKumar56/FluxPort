import express from "express";
import pool from "../db/index.js";
import { authenticateToken } from "../middleware/auth.js";
import crypto from "crypto";

const router = express.Router();

// ============================================================================
// WORKSPACE SETTINGS
// ============================================================================

// Get all settings for a workspace
router.get("/workspace/:workspaceId", authenticateToken, async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Check access
    const accessCheck = await pool.query(
      `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
      [workspaceId, req.user.userId],
    );

    if (accessCheck.rows.length === 0) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    const result = await pool.query(
      "SELECT key, value FROM workspace_settings WHERE workspace_id = $1",
      [workspaceId],
    );

    // Convert to object - return empty object if no settings exist
    const settings = {};
    result.rows.forEach((row) => {
      settings[row.key] = row.value;
    });

    console.log("Returning workspace settings:", Object.keys(settings).length, "settings for workspace:", workspaceId);
    res.json(settings);
  } catch (error) {
    console.error("Get workspace settings error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a specific setting
router.get(
  "/workspace/:workspaceId/:key",
  authenticateToken,
  async (req, res) => {
    try {
      const { workspaceId, key } = req.params;
      console.log("Fetching specific setting:", { workspaceId, key, user: req.user.userId });

      // Check access
      const accessCheck = await pool.query(
        `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
        [workspaceId, req.user.userId],
      );

      if (accessCheck.rows.length === 0) {
        console.log("Access denied for workspace:", workspaceId);
        return res.status(404).json({ error: "Workspace not found" });
      }

      const result = await pool.query(
        "SELECT value FROM workspace_settings WHERE workspace_id = $1 AND key = $2",
        [workspaceId, key],
      );

      console.log("Setting query result:", { rows: result.rows.length, workspaceId, key });

      if (result.rows.length === 0) {
        console.log("Setting not found:", { workspaceId, key });
        return res.status(404).json({ error: "Setting not found" });
      }

      console.log("Returning setting value for", key);
      res.json(result.rows[0].value);
    } catch (error) {
      console.error("Get setting error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Update/create a setting
router.put(
  "/workspace/:workspaceId/:key",
  authenticateToken,
  async (req, res) => {
    try {
      const { workspaceId, key } = req.params;
      const { value } = req.body;

      // Check permissions (admin or owner)
      const accessCheck = await pool.query(
        `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
        [workspaceId, req.user.userId],
      );

      if (accessCheck.rows.length === 0) {
        return res.status(404).json({ error: "Workspace not found" });
      }

      const userRole = accessCheck.rows[0].role;
      if (!["owner", "admin"].includes(userRole)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      const result = await pool.query(
        `INSERT INTO workspace_settings (workspace_id, key, value, updated_by)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (workspace_id, key) 
       DO UPDATE SET value = $3, updated_by = $4, updated_at = NOW()
       RETURNING *`,
        [workspaceId, key, JSON.stringify(value), req.user.userId],
      );

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Update setting error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Delete a setting
router.delete(
  "/workspace/:workspaceId/:key",
  authenticateToken,
  async (req, res) => {
    try {
      const { workspaceId, key } = req.params;

      // Check permissions
      const accessCheck = await pool.query(
        `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
        [workspaceId, req.user.userId],
      );

      if (accessCheck.rows.length === 0) {
        return res.status(404).json({ error: "Workspace not found" });
      }

      const userRole = accessCheck.rows[0].role;
      if (!["owner", "admin"].includes(userRole)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      await pool.query(
        "DELETE FROM workspace_settings WHERE workspace_id = $1 AND key = $2",
        [workspaceId, key],
      );

      res.json({ message: "Setting deleted" });
    } catch (error) {
      console.error("Delete setting error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

// Get all environment variables for a workspace
router.get(
  "/workspace/:workspaceId/env",
  authenticateToken,
  async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const { environment = "default" } = req.query;

      // Check access
      const accessCheck = await pool.query(
        `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
        [workspaceId, req.user.userId],
      );

      if (accessCheck.rows.length === 0) {
        return res.status(404).json({ error: "Workspace not found" });
      }

      const result = await pool.query(
        `SELECT id, name, key, value, is_encrypted, environment, created_at
       FROM environment_variables 
       WHERE workspace_id = $1 AND environment = $2
       ORDER BY key`,
        [workspaceId, environment],
      );

      // Mask encrypted values
      const variables = result.rows.map((row) => ({
        ...row,
        value: row.is_encrypted ? "••••••••" : row.value,
      }));

      res.json(variables);
    } catch (error) {
      console.error("Get env vars error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Create environment variable
router.post(
  "/workspace/:workspaceId/env",
  authenticateToken,
  async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const {
        name,
        key,
        value,
        is_encrypted = false,
        environment = "default",
      } = req.body;

      if (!key || !value) {
        return res.status(400).json({ error: "Key and value are required" });
      }

      // Check permissions
      const accessCheck = await pool.query(
        `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
        [workspaceId, req.user.userId],
      );

      if (accessCheck.rows.length === 0) {
        return res.status(404).json({ error: "Workspace not found" });
      }

      const userRole = accessCheck.rows[0].role;
      if (!["owner", "admin", "editor"].includes(userRole)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      const result = await pool.query(
        `INSERT INTO environment_variables (workspace_id, name, key, value, is_encrypted, environment, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (workspace_id, key, environment) 
       DO UPDATE SET value = $4, is_encrypted = $5, updated_at = NOW()
       RETURNING *`,
        [
          workspaceId,
          name,
          key,
          value,
          is_encrypted,
          environment,
          req.user.userId,
        ],
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Create env var error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Update environment variable
router.put(
  "/workspace/:workspaceId/env/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const { workspaceId, id } = req.params;
      const { name, value, is_encrypted } = req.body;

      // Check permissions
      const accessCheck = await pool.query(
        `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
        [workspaceId, req.user.userId],
      );

      if (accessCheck.rows.length === 0) {
        return res.status(404).json({ error: "Workspace not found" });
      }

      const userRole = accessCheck.rows[0].role;
      if (!["owner", "admin", "editor"].includes(userRole)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      const result = await pool.query(
        `UPDATE environment_variables 
       SET name = COALESCE($1, name),
           value = COALESCE($2, value),
           is_encrypted = COALESCE($3, is_encrypted),
           updated_at = NOW()
       WHERE id = $4 AND workspace_id = $5
       RETURNING *`,
        [name, value, is_encrypted, id, workspaceId],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Variable not found" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Update env var error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Delete environment variable
router.delete(
  "/workspace/:workspaceId/env/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const { workspaceId, id } = req.params;

      // Check permissions
      const accessCheck = await pool.query(
        `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
        [workspaceId, req.user.userId],
      );

      if (accessCheck.rows.length === 0) {
        return res.status(404).json({ error: "Workspace not found" });
      }

      const userRole = accessCheck.rows[0].role;
      if (!["owner", "admin", "editor"].includes(userRole)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      await pool.query(
        "DELETE FROM environment_variables WHERE id = $1 AND workspace_id = $2",
        [id, workspaceId],
      );

      res.json({ message: "Variable deleted" });
    } catch (error) {
      console.error("Delete env var error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// ============================================================================
// API KEYS
// ============================================================================

// Get all API keys for a workspace
router.get(
  "/workspace/:workspaceId/api-keys",
  authenticateToken,
  async (req, res) => {
    try {
      const { workspaceId } = req.params;

      // Check access
      const accessCheck = await pool.query(
        `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
        [workspaceId, req.user.userId],
      );

      if (accessCheck.rows.length === 0) {
        return res.status(404).json({ error: "Workspace not found" });
      }

      const result = await pool.query(
        `SELECT id, name, key_prefix, scopes, last_used_at, created_at, is_active, created_by
       FROM api_keys 
       WHERE workspace_id = $1
       ORDER BY created_at DESC`,
        [workspaceId],
      );

      res.json(result.rows);
    } catch (error) {
      console.error("Get API keys error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Create API key
router.post(
  "/workspace/:workspaceId/api-keys",
  authenticateToken,
  async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const { name, scopes = ["read"], expires_in_days } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }

      // Check permissions
      const accessCheck = await pool.query(
        `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
        [workspaceId, req.user.userId],
      );

      if (accessCheck.rows.length === 0) {
        return res.status(404).json({ error: "Workspace not found" });
      }

      const userRole = accessCheck.rows[0].role;
      if (!["owner", "admin"].includes(userRole)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      // Generate API key
      const apiKey = `fp_${crypto.randomBytes(32).toString("hex")}`;
      const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex");
      const keyPrefix = apiKey.substring(0, 10);

      let expiresAt = null;
      if (expires_in_days) {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expires_in_days);
      }

      const result = await pool.query(
        `INSERT INTO api_keys (workspace_id, name, key_hash, key_prefix, scopes, expires_at, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, key_prefix, scopes, expires_at, created_at`,
        [
          workspaceId,
          name,
          keyHash,
          keyPrefix,
          JSON.stringify(scopes),
          expiresAt,
          req.user.userId,
        ],
      );

      // Return the full key only once
      res.status(201).json({
        ...result.rows[0],
        api_key: apiKey, // Full key - only shown once
      });
    } catch (error) {
      console.error("Create API key error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Delete API key
router.delete(
  "/workspace/:workspaceId/api-keys/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const { workspaceId, id } = req.params;

      // Check permissions
      const accessCheck = await pool.query(
        `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
        [workspaceId, req.user.userId],
      );

      if (accessCheck.rows.length === 0) {
        return res.status(404).json({ error: "Workspace not found" });
      }

      const userRole = accessCheck.rows[0].role;
      if (!["owner", "admin"].includes(userRole)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      await pool.query(
        "DELETE FROM api_keys WHERE id = $1 AND workspace_id = $2",
        [id, workspaceId],
      );

      res.json({ message: "API key deleted" });
    } catch (error) {
      console.error("Delete API key error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
