import express from 'express';
import pool from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get saved requests for a collection
router.get('/collection/:collectionId', authenticateToken, async (req, res) => {
  try {
    const { collectionId } = req.params;

    // Verify collection belongs to user
    const collectionCheck = await pool.query(
      'SELECT id FROM "Collection" WHERE id = $1 AND "userId" = $2',
      [collectionId, req.user.userId]
    );

    if (collectionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const result = await pool.query(
      'SELECT * FROM "SavedRequest" WHERE "collectionId" = $1 ORDER BY "createdAt" DESC',
      [collectionId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get saved requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create saved request
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, method, url, collectionId, folderId, headers, body } = req.body;
    if (!name || !method || !url || !collectionId) {
      return res.status(400).json({ error: 'Name, method, url, and collectionId are required' });
    }

    // Verify collection belongs to user
    const collectionCheck = await pool.query(
      'SELECT id FROM "Collection" WHERE id = $1 AND "userId" = $2',
      [collectionId, req.user.userId]
    );

    if (collectionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const result = await pool.query(
      `INSERT INTO "SavedRequest" (id, name, method, url, "collectionId", "folderId", headers, body, "createdAt", "updatedAt") 
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *`,
      [name, method, url, collectionId, folderId || null, JSON.stringify(headers || {}), body || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create saved request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update saved request
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, method, url, folderId, headers, body } = req.body;

    // Verify request belongs to user's collection
    const requestCheck = await pool.query(
      `SELECT sr.id FROM "SavedRequest" sr 
       JOIN "Collection" c ON sr."collectionId" = c.id 
       WHERE sr.id = $1 AND c."userId" = $2`,
      [id, req.user.userId]
    );

    if (requestCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Saved request not found' });
    }

    const result = await pool.query(
      `UPDATE "SavedRequest" 
       SET name = $1, method = $2, url = $3, "folderId" = $4, headers = $5, body = $6, "updatedAt" = NOW() 
       WHERE id = $7 RETURNING *`,
      [name, method, url, folderId || null, JSON.stringify(headers || {}), body || null, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update saved request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete saved request
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify request belongs to user's collection
    const requestCheck = await pool.query(
      `SELECT sr.id FROM "SavedRequest" sr 
       JOIN "Collection" c ON sr."collectionId" = c.id 
       WHERE sr.id = $1 AND c."userId" = $2`,
      [id, req.user.userId]
    );

    if (requestCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Saved request not found' });
    }

    await pool.query('DELETE FROM "SavedRequest" WHERE id = $1', [id]);
    res.json({ message: 'Saved request deleted' });
  } catch (error) {
    console.error('Delete saved request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

