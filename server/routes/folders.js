import express from "express";
import pool from "../db/index.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get folders for a collection
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
      `SELECT f.*
       FROM folders f
       WHERE f.collection_id = $1
       ORDER BY f.created_at DESC`,
      [collectionId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get folders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create folder
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, collectionId } = req.body;
    if (!name || !collectionId) {
      return res
        .status(400)
        .json({ error: "Name and collectionId are required" });
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
      `INSERT INTO folders (collection_id, name)
       VALUES ($1, $2) RETURNING *`,
      [collectionId, name],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create folder error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update folder
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Verify folder access
    const folderCheck = await pool.query(
      `SELECT f.id FROM folders f 
       JOIN collections c ON f.collection_id = c.id 
       JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
       WHERE f.id = $1 AND wm.user_id = $2 AND wm.status = 'active'`,
      [id, req.user.userId],
    );

    if (folderCheck.rows.length === 0) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const result = await pool.query(
      "UPDATE folders SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [name, id],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update folder error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete folder
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify folder access
    const folderCheck = await pool.query(
      `SELECT f.id FROM folders f 
       JOIN collections c ON f.collection_id = c.id 
       JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
       WHERE f.id = $1 AND wm.user_id = $2 AND wm.status = 'active'`,
      [id, req.user.userId],
    );

    if (folderCheck.rows.length === 0) {
      return res.status(404).json({ error: "Folder not found" });
    }

    await pool.query("DELETE FROM folders WHERE id = $1", [id]);
    res.json({ message: "Folder deleted" });
  } catch (error) {
    console.error("Delete folder error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
