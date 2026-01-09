import express from 'express';
import pool from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get folders for a collection
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
      'SELECT * FROM "Folder" WHERE "collectionId" = $1 ORDER BY "createdAt" DESC',
      [collectionId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get folders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create folder
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, collectionId } = req.body;
    if (!name || !collectionId) {
      return res.status(400).json({ error: 'Name and collectionId are required' });
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
      'INSERT INTO "Folder" (id, name, "collectionId", "createdAt", "updatedAt") VALUES (gen_random_uuid()::text, $1, $2, NOW(), NOW()) RETURNING *',
      [name, collectionId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create folder error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update folder
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Verify folder belongs to user's collection
    const folderCheck = await pool.query(
      `SELECT f.id FROM "Folder" f 
       JOIN "Collection" c ON f."collectionId" = c.id 
       WHERE f.id = $1 AND c."userId" = $2`,
      [id, req.user.userId]
    );

    if (folderCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const result = await pool.query(
      'UPDATE "Folder" SET name = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING *',
      [name, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update folder error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete folder
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify folder belongs to user's collection
    const folderCheck = await pool.query(
      `SELECT f.id FROM "Folder" f 
       JOIN "Collection" c ON f."collectionId" = c.id 
       WHERE f.id = $1 AND c."userId" = $2`,
      [id, req.user.userId]
    );

    if (folderCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    await pool.query('DELETE FROM "Folder" WHERE id = $1', [id]);
    res.json({ message: 'Folder deleted' });
  } catch (error) {
    console.error('Delete folder error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

