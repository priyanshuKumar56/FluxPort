import express from "express";
import pool from "../db/index.js";
import { authenticateToken } from "../middleware/auth.js";
import crypto from "crypto";

const router = express.Router();

// Get all workspaces for the current user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT w.*, wm.role as member_role 
       FROM workspaces w
       JOIN workspace_members wm ON w.id = wm.workspace_id
       WHERE wm.user_id = $1 AND wm.status = 'active'
       ORDER BY w.created_at DESC`,
      [req.user.userId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get workspaces error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a single workspace by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user has access to this workspace
    const accessCheck = await pool.query(
      `SELECT w.*, wm.role as member_role 
       FROM workspaces w
       JOIN workspace_members wm ON w.id = wm.workspace_id
       WHERE w.id = $1 AND wm.user_id = $2 AND wm.status = 'active'`,
      [id, req.user.userId],
    );

    if (accessCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Workspace not found or access denied" });
    }

    res.json(accessCheck.rows[0]);
  } catch (error) {
    console.error("Get workspace error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new workspace
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, description, is_personal = false } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Workspace name is required" });
    }

    // Generate unique slug
    const slug = `ws-${crypto.randomBytes(4).toString("hex").toLowerCase()}`;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Create workspace
      const workspaceResult = await client.query(
        `INSERT INTO workspaces (name, slug, description, owner_id, is_personal)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, slug, description, req.user.userId, is_personal],
      );

      const workspace = workspaceResult.rows[0];

      // Add creator as owner
      await client.query(
        `INSERT INTO workspace_members (workspace_id, user_id, role, joined_at)
         VALUES ($1, $2, 'owner', NOW())`,
        [workspace.id, req.user.userId],
      );

      await client.query("COMMIT");
      res.status(201).json({ ...workspace, member_role: "owner" });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Create workspace error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a workspace
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, settings } = req.body;

    // Check if user has admin/owner access
    const accessCheck = await pool.query(
      `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
      [id, req.user.userId],
    );

    if (accessCheck.rows.length === 0) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    const userRole = accessCheck.rows[0].role;
    if (!["owner", "admin"].includes(userRole)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    const result = await pool.query(
      `UPDATE workspaces 
       SET name = COALESCE($1, name), 
           description = COALESCE($2, description),
           settings = COALESCE($3, settings),
           updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [name, description, settings ? JSON.stringify(settings) : null, id],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update workspace error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a workspace
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Only owner can delete
    const accessCheck = await pool.query(
      `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
      [id, req.user.userId],
    );

    if (accessCheck.rows.length === 0 || accessCheck.rows[0].role !== "owner") {
      return res.status(403).json({ error: "Only workspace owner can delete" });
    }

    await pool.query("DELETE FROM workspaces WHERE id = $1", [id]);
    res.json({ message: "Workspace deleted successfully" });
  } catch (error) {
    console.error("Delete workspace error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================================================
// MEMBER MANAGEMENT
// ============================================================================

// Get workspace members
router.get("/:id/members", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user has access
    const accessCheck = await pool.query(
      `SELECT 1 FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
      [id, req.user.userId],
    );

    if (accessCheck.rows.length === 0) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    const result = await pool.query(
      `SELECT wm.id, wm.user_id, wm.role, wm.status, wm.joined_at,
              u.email, u.full_name, u.avatar_url
       FROM workspace_members wm
       JOIN users u ON wm.user_id = u.id
       WHERE wm.workspace_id = $1
       ORDER BY wm.joined_at DESC`,
      [id],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get workspace members error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get workspace invitations
router.get("/:id/invitations", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user has access
    const accessCheck = await pool.query(
      `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
      [id, req.user.userId],
    );

    if (accessCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Workspace not found" });
    }

    const result = await pool.query(
      `SELECT wi.*, u.email as invited_email, u.full_name as invited_name
       FROM workspace_invitations wi
       LEFT JOIN users u ON wi.email = u.email
       WHERE wi.workspace_id = $1
       ORDER BY wi.created_at DESC`,
      [id],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get workspace invitations error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Invite a member by email
router.post("/:id/invite", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role = "viewer" } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if user has permission to invite
    const accessCheck = await pool.query(
      `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
      [id, req.user.userId],
    );

    if (accessCheck.rows.length === 0) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    const userRole = accessCheck.rows[0].role;
    if (!["owner", "admin"].includes(userRole)) {
      return res
        .status(403)
        .json({ error: "Insufficient permissions to invite" });
    }

    // Check if user is already a member
    const existingMember = await pool.query(
      `SELECT 1 FROM workspace_members wm
       JOIN users u ON wm.user_id = u.id
       WHERE wm.workspace_id = $1 AND u.email = $2`,
      [id, email],
    );

    if (existingMember.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "User is already a member of this workspace" });
    }

    // Check for existing pending invitation
    const existingInvite = await pool.query(
      `SELECT 1 FROM workspace_invitations 
       WHERE workspace_id = $1 AND email = $2 AND accepted_at IS NULL 
       AND expires_at > NOW()`,
      [id, email],
    );

    if (existingInvite.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Pending invitation already exists" });
    }

    // Generate invitation token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    await pool.query(
      `INSERT INTO workspace_invitations (workspace_id, email, role, token, invited_by, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, email, role, token, req.user.userId, expiresAt],
    );

    // Generate invite link
    const inviteLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/invite/${token}`;

    res.json({
      message: "Invitation sent successfully",
      inviteLink,
      token,
    });
  } catch (error) {
    console.error("Invite member error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Accept invitation
router.post("/invite/accept", authenticateToken, async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Invitation token is required" });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Get invitation
      const inviteResult = await client.query(
        `SELECT * FROM workspace_invitations 
         WHERE token = $1 AND accepted_at IS NULL AND expires_at > NOW()`,
        [token],
      );

      if (inviteResult.rows.length === 0) {
        return res.status(400).json({ error: "Invalid or expired invitation" });
      }

      const invitation = inviteResult.rows[0];

      // Get user by email
      const userResult = await client.query(
        "SELECT id FROM users WHERE email = $1",
        [invitation.email],
      );

      if (userResult.rows.length === 0) {
        return res
          .status(400)
          .json({
            error: "No user found with this email. Please sign up first.",
          });
      }

      const userId = userResult.rows[0].id;

      // Add user to workspace
      await client.query(
        `INSERT INTO workspace_members (workspace_id, user_id, role, invited_by, invited_at, joined_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (workspace_id, user_id) DO UPDATE SET status = 'active'`,
        [
          invitation.workspace_id,
          userId,
          invitation.role,
          invitation.invited_by,
          invitation.invited_at,
        ],
      );

      // Mark invitation as accepted
      await client.query(
        "UPDATE workspace_invitations SET accepted_at = NOW() WHERE id = $1",
        [invitation.id],
      );

      await client.query("COMMIT");
      res.json({ message: "Invitation accepted successfully" });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Accept invitation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update member role
router.put("/:id/members/:memberId", authenticateToken, async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const { role } = req.body;

    // Check if user has permission
    const accessCheck = await pool.query(
      `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
      [id, req.user.userId],
    );

    if (accessCheck.rows.length === 0) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    const userRole = accessCheck.rows[0].role;
    if (!["owner", "admin"].includes(userRole)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    // Cannot change owner's role
    const memberCheck = await pool.query(
      "SELECT role FROM workspace_members WHERE id = $1",
      [memberId],
    );

    if (memberCheck.rows.length === 0) {
      return res.status(404).json({ error: "Member not found" });
    }

    if (memberCheck.rows[0].role === "owner") {
      return res.status(403).json({ error: "Cannot modify owner role" });
    }

    await pool.query("UPDATE workspace_members SET role = $1 WHERE id = $2", [
      role,
      memberId,
    ]);

    res.json({ message: "Member role updated" });
  } catch (error) {
    console.error("Update member role error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Remove member from workspace
router.delete("/:id/members/:memberId", authenticateToken, async (req, res) => {
  try {
    const { id, memberId } = req.params;

    // Check if user has permission
    const accessCheck = await pool.query(
      `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
      [id, req.user.userId],
    );

    if (accessCheck.rows.length === 0) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    const userRole = accessCheck.rows[0].role;

    // Get member being removed
    const memberCheck = await pool.query(
      "SELECT user_id, role FROM workspace_members WHERE id = $1",
      [memberId],
    );

    if (memberCheck.rows.length === 0) {
      return res.status(404).json({ error: "Member not found" });
    }

    const memberToRemove = memberCheck.rows[0];

    // Only owner can remove admins, admins can remove editors/viewers
    if (memberToRemove.role === "owner") {
      return res.status(403).json({ error: "Cannot remove workspace owner" });
    }

    if (memberToRemove.role === "admin" && userRole !== "owner") {
      return res.status(403).json({ error: "Only owner can remove admins" });
    }

    // Users can remove themselves
    if (
      memberToRemove.user_id !== req.user.userId &&
      !["owner", "admin"].includes(userRole)
    ) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    await pool.query("UPDATE workspace_members SET status = $1 WHERE id = $2", [
      "inactive",
      memberId,
    ]);

    res.json({ message: "Member removed from workspace" });
  } catch (error) {
    console.error("Remove member error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Leave workspace
router.post("/:id/leave", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Cannot leave if you're the owner
    const accessCheck = await pool.query(
      `SELECT role FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
      [id, req.user.userId],
    );

    if (accessCheck.rows.length === 0) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    if (accessCheck.rows[0].role === "owner") {
      return res
        .status(400)
        .json({
          error:
            "Owner cannot leave workspace. Transfer ownership or delete workspace instead.",
        });
    }

    await pool.query(
      "UPDATE workspace_members SET status = $1 WHERE workspace_id = $2 AND user_id = $3",
      ["inactive", id, req.user.userId],
    );

    res.json({ message: "Left workspace successfully" });
  } catch (error) {
    console.error("Leave workspace error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
