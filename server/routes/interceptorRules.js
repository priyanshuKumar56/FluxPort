import express from "express";
import pool from "../db/index.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all interceptor rules for a workspace
router.get("/workspace/:workspaceId", authenticateToken, async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Check if user has access to this workspace
    const accessCheck = await pool.query(
      `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
      [workspaceId, req.user.userId],
    );

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ error: "Access denied to this workspace" });
    }

    const result = await pool.query(
      `SELECT ir.id, ir.workspace_id, ir.name, ir.description, ir.type,
              ir.match_type as "matchType", ir.match_pattern as "matchPattern",
              ir.methods, ir.config, ir.priority, ir.is_active as "isActive",
              ir.created_by, ir.created_at, ir.updated_at,
              u.email as created_by_email, u.full_name as created_by_name
       FROM interceptor_rules ir
       LEFT JOIN users u ON ir.created_by = u.id
       WHERE ir.workspace_id = $1 
       ORDER BY ir.priority DESC, ir.created_at DESC`,
      [workspaceId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get interceptor rules error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create interceptor rule (workspace-scoped)
router.post("/workspace/:workspaceId", authenticateToken, async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const {
      name,
      description,
      type,
      isActive,
      priority,
      matchType,
      matchPattern,
      methods,
      config,
    } = req.body;

    if (!name || !type || !matchPattern) {
      return res
        .status(400)
        .json({ error: "Name, type, and matchPattern are required" });
    }

    // Check permissions (editor, admin, or owner)
    const accessCheck = await pool.query(
      `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
      [workspaceId, req.user.userId],
    );

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ error: "Access denied to this workspace" });
    }

    const role = accessCheck.rows[0].role;
    if (!["owner", "admin", "editor"].includes(role)) {
      return res
        .status(403)
        .json({ error: "Insufficient permissions to create rules" });
    }

    const result = await pool.query(
      `INSERT INTO interceptor_rules (workspace_id, name, description, type, is_active, priority, match_type, match_pattern, methods, config, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING id, workspace_id, name, description, type,
                match_type as "matchType", match_pattern as "matchPattern",
                methods, config, priority, is_active as "isActive",
                created_by, created_at, updated_at`,
      [
        workspaceId,
        name,
        description || null,
        type,
        isActive !== undefined ? isActive : true,
        priority || 0,
        matchType || "contains",
        matchPattern,
        methods || null,
        config ? JSON.stringify(config) : "{}",
        req.user.userId,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create interceptor rule error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update interceptor rule
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      type,
      isActive,
      priority,
      matchType,
      matchPattern,
      methods,
      config,
    } = req.body;

    // First check if user has access to the workspace this rule belongs to
    const ruleCheck = await pool.query(
      `SELECT ir.workspace_id, wm.role 
       FROM interceptor_rules ir
       JOIN workspace_members wm ON ir.workspace_id = wm.workspace_id
       WHERE ir.id = $1 AND wm.user_id = $2 AND wm.status = 'active'`,
      [id, req.user.userId],
    );

    if (ruleCheck.rows.length === 0) {
      return res.status(404).json({ error: "Rule not found or access denied" });
    }

    const role = ruleCheck.rows[0].role;
    if (!["owner", "admin", "editor"].includes(role)) {
      return res
        .status(403)
        .json({ error: "Insufficient permissions to update rules" });
    }

    const result = await pool.query(
      `UPDATE interceptor_rules 
       SET name = COALESCE($1, name), 
           description = COALESCE($2, description), 
           type = COALESCE($3, type), 
           is_active = COALESCE($4, is_active), 
           priority = COALESCE($5, priority), 
           match_type = COALESCE($6, match_type), 
           match_pattern = COALESCE($7, match_pattern), 
           methods = COALESCE($8, methods), 
           config = COALESCE($9, config), 
           updated_at = NOW() 
       WHERE id = $10 
       RETURNING id, workspace_id, name, description, type,
                match_type as "matchType", match_pattern as "matchPattern",
                methods, config, priority, is_active as "isActive",
                created_by, created_at, updated_at`,
      [
        name,
        description,
        type,
        isActive,
        priority,
        matchType,
        matchPattern,
        methods,
        config ? JSON.stringify(config) : null,
        id,
      ],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update interceptor rule error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete interceptor rule
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check access
    const ruleCheck = await pool.query(
      `SELECT ir.workspace_id, wm.role 
       FROM interceptor_rules ir
       JOIN workspace_members wm ON ir.workspace_id = wm.workspace_id
       WHERE ir.id = $1 AND wm.user_id = $2 AND wm.status = 'active'`,
      [id, req.user.userId],
    );

    if (ruleCheck.rows.length === 0) {
      return res.status(404).json({ error: "Rule not found or access denied" });
    }

    const role = ruleCheck.rows[0].role;
    if (!["owner", "admin", "editor"].includes(role)) {
      return res
        .status(403)
        .json({ error: "Insufficient permissions to delete rules" });
    }

    await pool.query("DELETE FROM interceptor_rules WHERE id = $1", [id]);
    res.json({ message: "Interceptor rule deleted" });
  } catch (error) {
    console.error("Delete interceptor rule error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get active rules for proxy (internal use - with workspace context)
router.post("/active-for-proxy", authenticateToken, async (req, res) => {
  try {
    const { workspaceId } = req.body;

    if (!workspaceId) {
      return res.status(400).json({ error: "Workspace ID required" });
    }

    // Verify user has access
    const accessCheck = await pool.query(
      `SELECT 1 FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
      [workspaceId, req.user.userId],
    );

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ error: "Access denied" });
    }

    const result = await pool.query(
      `SELECT id, match_pattern as "matchPattern", methods, type, config, priority, is_active as "isActive"
       FROM interceptor_rules 
       WHERE workspace_id = $1 AND is_active = true
       ORDER BY priority DESC`,
      [workspaceId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get active rules error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
