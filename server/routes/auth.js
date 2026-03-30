import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/index.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user exists
    const t0 = Date.now();
    const existingUser = await pool.query(
      'SELECT id FROM "User" WHERE email = $1',
      [email],
    );
    const t1 = Date.now();
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const t2 = Date.now();
    const hashedPassword = await bcrypt.hash(password, 10);
    const t3 = Date.now();

    // Create user
    const t4 = Date.now();
    const result = await pool.query(
      'INSERT INTO "User" (id, email, password, "createdAt", "updatedAt") VALUES (gen_random_uuid()::text, $1, $2, NOW(), NOW()) RETURNING id, email, "createdAt"',
      [email, hashedPassword],
    );
    const t5 = Date.now();

    // Avoid noisy logs in production (serverless log cost + response latency).
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[AUTH] Register diagnostics: DB_CHECK: ${t1 - t0}ms, HASH: ${t3 - t2}ms, DB_INSERT: ${t5 - t4}ms`,
      );
    }

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    );

    res.status(201).json({
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      detail: error.detail,
    });
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
      code: error.code,
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const t0 = Date.now();
    const result = await pool.query('SELECT * FROM "User" WHERE email = $1', [
      email,
    ]);
    const t1 = Date.now();
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Verify password
    const t2 = Date.now();
    const isValid = await bcrypt.compare(password, user.password);
    const t3 = Date.now();

    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[AUTH] Login diagnostics: DB_FIND: ${t1 - t0}ms, COMPARE: ${t3 - t2}ms`,
      );
    }

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    );

    res.json({
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get current user
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    );
    const result = await pool.query(
      'SELECT id, email, "createdAt" FROM "User" WHERE id = $1',
      [decoded.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
