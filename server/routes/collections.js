import express from "express";
import pool from "../db/index.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Helper: Check workspace access
async function checkWorkspaceAccess(
  userId,
  workspaceId,
  requiredRoles = ["owner", "admin", "editor", "viewer"],
) {
  const result = await pool.query(
    `SELECT role FROM workspace_members 
     WHERE workspace_id = $1 AND user_id = $2 AND status = 'active'`,
    [workspaceId, userId],
  );
  if (result.rows.length === 0) return null;
  const role = result.rows[0].role;
  return requiredRoles.includes(role) ? role : null;
}

// ============================================================================
// WORKSPACE-SCOPED COLLECTIONS
// ============================================================================

// Get all collections for workspace
router.get("/workspace/:workspaceId", authenticateToken, async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const access = await checkWorkspaceAccess(req.user.userId, workspaceId);
    if (!access) {
      return res.status(403).json({ error: "Access denied to this workspace" });
    }

    const result = await pool.query(
      `SELECT c.*, u.email as created_by_email, u.full_name as created_by_name,
              (SELECT COUNT(*) FROM folders f WHERE f.collection_id = c.id) as folder_count,
              (SELECT COUNT(*) FROM saved_requests sr WHERE sr.collection_id = c.id) as request_count
       FROM collections c
       LEFT JOIN users u ON c.created_by = u.id
       WHERE c.workspace_id = $1
       ORDER BY c.created_at DESC`,
      [workspaceId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get collections error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create collection in workspace
router.post("/workspace/:workspaceId", authenticateToken, async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const access = await checkWorkspaceAccess(req.user.userId, workspaceId, [
      "owner",
      "admin",
      "editor",
    ]);
    if (!access) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    const result = await pool.query(
      `INSERT INTO collections (workspace_id, name, description, created_by) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [workspaceId, name, description || null, req.user.userId],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create collection error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Simple check if collection exists and user has access
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT c.id, c.name, c.workspace_id, wm.role as user_role
       FROM collections c
       JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
       WHERE c.id = $1 AND wm.user_id = $2 AND wm.status = 'active'`,
      [id, req.user.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Collection not found or access denied" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Check collection error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get full collection tree (with folders and requests)
router.get("/:id/tree", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get collection with workspace check
    const collectionResult = await pool.query(
      `SELECT c.*, wm.role as user_role
       FROM collections c
       JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
       WHERE c.id = $1 AND wm.user_id = $2 AND wm.status = 'active'`,
      [id, req.user.userId],
    );
    

    if (collectionResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Collection not found or access denied" });
    }

    const collection = collectionResult.rows[0];

    // Get folders
    const foldersResult = await pool.query(
      `SELECT f.*
       FROM folders f
       WHERE f.collection_id = $1
       ORDER BY f.name`,
      [id],
    );
    

    // Get requests (both in collection root and in folders)
    const requestsResult = await pool.query(
      `SELECT sr.*, u.email as created_by_email
       FROM saved_requests sr
       LEFT JOIN users u ON sr.created_by = u.id
       WHERE sr.collection_id = $1
       ORDER BY sr.name`,
      [id],
    );
    

    // Build tree structure
    const folders = foldersResult.rows;
    const requests = requestsResult.rows;
    

    // Group requests by folder
    const folderMap = new Map();
    folders.forEach((folder) => {
      folder.requests = [];
      folderMap.set(folder.id, folder);
    });

    const rootRequests = [];
    requests.forEach((request) => {
      if (request.folder_id && folderMap.has(request.folder_id)) {
        folderMap.get(request.folder_id).requests.push(request);
      } else {
        rootRequests.push(request);
      }
    });

    res.json({
      ...collection,
      folders: folders,
      requests: rootRequests,
    });
  } catch (error) {
    console.error("Get collection tree error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update collection
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Check permissions
    const accessCheck = await pool.query(
      `SELECT c.workspace_id, wm.role 
       FROM collections c
       JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
       WHERE c.id = $1 AND wm.user_id = $2 AND wm.status = 'active'`,
      [id, req.user.userId],
    );

    if (accessCheck.rows.length === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const role = accessCheck.rows[0].role;
    if (!["owner", "admin", "editor"].includes(role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    const result = await pool.query(
      `UPDATE collections 
       SET name = COALESCE($1, name), 
           description = COALESCE($2, description),
           updated_at = NOW() 
       WHERE id = $3 RETURNING *`,
      [name, description, id],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update collection error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete collection
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check permissions
    const accessCheck = await pool.query(
      `SELECT c.workspace_id, wm.role 
       FROM collections c
       JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
       WHERE c.id = $1 AND wm.user_id = $2 AND wm.status = 'active'`,
      [id, req.user.userId],
    );

    if (accessCheck.rows.length === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const role = accessCheck.rows[0].role;
    if (!["owner", "admin"].includes(role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    await pool.query("DELETE FROM collections WHERE id = $1", [id]);
    res.json({ message: "Collection deleted" });
  } catch (error) {
    console.error("Delete collection error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================================================
// FOLDERS
// ============================================================================

// Create folder
router.post("/:collectionId/folders", authenticateToken, async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { name, parent_folder_id } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Check collection access
    const accessCheck = await pool.query(
      `SELECT c.workspace_id, wm.role 
       FROM collections c
       JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
       WHERE c.id = $1 AND wm.user_id = $2 AND wm.status = 'active'`,
      [collectionId, req.user.userId],
    );

    if (accessCheck.rows.length === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const role = accessCheck.rows[0].role;
    if (!["owner", "admin", "editor"].includes(role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    const result = await pool.query(
      `INSERT INTO folders (collection_id, name, parent_folder_id) 
       VALUES ($1, $2, $3) RETURNING *`,
      [
        collectionId,
        name,
        parent_folder_id || null,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create folder error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update folder
router.put("/folders/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Verify folder access through workspace
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
router.delete("/folders/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify folder access through workspace
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

// ============================================================================
// SAVED REQUESTS
// ============================================================================

// Create saved request
router.post("/:collectionId/requests", authenticateToken, async (req, res) => {
  try {
    const { collectionId } = req.params;
    const {
      folder_id,
      name,
      method,
      url,
      headers,
      body,
      params,
      auth,
    } = req.body;

    if (!name || !method || !url) {
      return res
        .status(400)
        .json({ error: "Name, method, and URL are required" });
    }

    // Check collection access
    const accessCheck = await pool.query(
      `SELECT c.workspace_id, wm.role 
       FROM collections c
       JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
       WHERE c.id = $1 AND wm.user_id = $2 AND wm.status = 'active'`,
      [collectionId, req.user.userId],
    );

    if (accessCheck.rows.length === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const role = accessCheck.rows[0].role;
    if (!["owner", "admin", "editor"].includes(role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    const result = await pool.query(
      `INSERT INTO saved_requests 
       (collection_id, folder_id, name, method, url, headers, body, params, auth, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        collectionId,
        folder_id || null,
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
    console.error("Create request error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update saved request
router.put("/requests/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      method,
      url,
      headers,
      body,
      params,
      auth,
    } = req.body;

    // Verify request access through workspace
    const requestCheck = await pool.query(
      `SELECT sr.id FROM saved_requests sr 
       JOIN collections c ON sr.collection_id = c.id 
       JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
       WHERE sr.id = $1 AND wm.user_id = $2 AND wm.status = 'active'`,
      [id, req.user.userId],
    );

    if (requestCheck.rows.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    const result = await pool.query(
      `UPDATE saved_requests 
       SET name = COALESCE($1, name),
           method = COALESCE($2, method),
           url = COALESCE($3, url),
           headers = COALESCE($4, headers),
           body = COALESCE($5, body),
           params = COALESCE($6, params),
           auth = COALESCE($7, auth),
           updated_at = NOW()
       WHERE id = $8 RETURNING *`,
      [
        name,
        method,
        url,
        headers ? JSON.stringify(headers) : null,
        body,
        params ? JSON.stringify(params) : null,
        auth ? JSON.stringify(auth) : null,
        id,
      ],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update request error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete saved request
router.delete("/requests/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify request access through workspace
    const requestCheck = await pool.query(
      `SELECT sr.id FROM saved_requests sr 
       JOIN collections c ON sr.collection_id = c.id 
       JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
       WHERE sr.id = $1 AND wm.user_id = $2 AND wm.status = 'active'`,
      [id, req.user.userId],
    );

    if (requestCheck.rows.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    await pool.query("DELETE FROM saved_requests WHERE id = $1", [id]);
    res.json({ message: "Request deleted" });
  } catch (error) {
    console.error("Delete request error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
