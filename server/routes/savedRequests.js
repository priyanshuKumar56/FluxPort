import express from "express";
import pool from "../db/index.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get saved requests for a collection
router.get("/collection/:collectionId", authenticateToken, async (req, res) => {
  try {
    const { collectionId } = req.params;

    // Verify collection access
    const collectionCheck = await pool.query(
      `SELECT c.id FROM collections c
       JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
       WHERE c.id = $1 AND wm.user_id = $2 AND wm.status = 'active'`,
      [collectionId, req.user.userId],
    );

    if (collectionCheck.rows.length === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const result = await pool.query(
      `SELECT sr.*, u.email as created_by_email
       FROM saved_requests sr
       LEFT JOIN users u ON sr.created_by = u.id
       WHERE sr.collection_id = $1
       ORDER BY sr.created_at DESC`,
      [collectionId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get saved requests error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create saved request
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, method, url, collectionId, folderId, headers, body } =
      req.body;
    if (!name || !method || !url || !collectionId) {
      return res
        .status(400)
        .json({ error: "Name, method, url, and collectionId are required" });
    }

    // Verify collection access
    const collectionCheck = await pool.query(
      `SELECT c.id FROM collections c
       JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
       WHERE c.id = $1 AND wm.user_id = $2 AND wm.status = 'active'`,
      [collectionId, req.user.userId],
    );

    if (collectionCheck.rows.length === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const result = await pool.query(
      `INSERT INTO saved_requests (collection_id, folder_id, name, method, url, headers, body, params, auth, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        collectionId,
        folderId || null,
        name,
        method,
        url,
        headers ? JSON.stringify(headers) : '{}',
        body || null,
        params ? JSON.stringify(params) : '{}',
        auth ? JSON.stringify(auth) : '{}',
        req.user.userId,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create saved request error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update saved request
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, method, url, folderId, headers, body } = req.body;

    // Verify request access
    const requestCheck = await pool.query(
      `SELECT sr.id FROM saved_requests sr 
       JOIN collections c ON sr.collection_id = c.id 
       JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
       WHERE sr.id = $1 AND wm.user_id = $2 AND wm.status = 'active'`,
      [id, req.user.userId],
    );

    if (requestCheck.rows.length === 0) {
      return res.status(404).json({ error: "Saved request not found" });
    }

    const result = await pool.query(
      `UPDATE saved_requests 
       SET name = COALESCE($1, name), method = COALESCE($2, method), url = COALESCE($3, url), 
           folder_id = COALESCE($4, folder_id), headers = COALESCE($5, headers), 
           body = COALESCE($6, body), params = COALESCE($7, params), auth = COALESCE($8, auth), updated_at = NOW() 
       WHERE id = $9 RETURNING *`,
      [
        name,
        method,
        url,
        folderId || null,
        headers ? JSON.stringify(headers) : null,
        body || null,
        params ? JSON.stringify(params) : null,
        auth ? JSON.stringify(auth) : null,
        id,
      ],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update saved request error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete saved request
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify request access
    const requestCheck = await pool.query(
      `SELECT sr.id FROM saved_requests sr 
       JOIN collections c ON sr.collection_id = c.id 
       JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
       WHERE sr.id = $1 AND wm.user_id = $2 AND wm.status = 'active'`,
      [id, req.user.userId],
    );

    if (requestCheck.rows.length === 0) {
      return res.status(404).json({ error: "Saved request not found" });
    }

    await pool.query("DELETE FROM saved_requests WHERE id = $1", [id]);
    res.json({ message: "Saved request deleted" });
  } catch (error) {
    console.error("Delete saved request error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
