import express from 'express';
import pool from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all interceptor rules for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM "InterceptorRule" WHERE "userId" = $1 ORDER BY "createdAt" DESC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get interceptor rules error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create interceptor rule
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, type, isActive, priority, matchType, matchPattern, methods, config } = req.body;
    if (!name || !type || !matchType || !matchPattern) {
      return res.status(400).json({ error: 'Name, type, matchType, and matchPattern are required' });
    }

    const result = await pool.query(
      `INSERT INTO "InterceptorRule" (id, "userId", name, description, type, "isActive", priority, "matchType", "matchPattern", methods, config, "createdAt", "updatedAt") 
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) RETURNING *`,
      [
        req.user.userId,
        name,
        description || null,
        type,
        isActive !== undefined ? isActive : true,
        priority || 0,
        matchType,
        matchPattern,
        methods || null,
        config ? JSON.stringify(config) : null
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create interceptor rule error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update interceptor rule
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, type, isActive, priority, matchType, matchPattern, methods, config } = req.body;

    const result = await pool.query(
      `UPDATE "InterceptorRule" 
       SET name = $1, description = $2, type = $3, "isActive" = $4, priority = $5, "matchType" = $6, "matchPattern" = $7, methods = $8, config = $9, "updatedAt" = NOW() 
       WHERE id = $10 AND "userId" = $11 RETURNING *`,
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
        req.user.userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Interceptor rule not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update interceptor rule error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete interceptor rule
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM "InterceptorRule" WHERE id = $1 AND "userId" = $2 RETURNING *',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Interceptor rule not found' });
    }

    res.json({ message: 'Interceptor rule deleted' });
  } catch (error) {
    console.error('Delete interceptor rule error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

