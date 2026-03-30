import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import pool from "./db/index.js";
import authRoutes from "./routes/auth.js";
import collectionsRoutes from "./routes/collections.js";
import foldersRoutes from "./routes/folders.js";
import savedRequestsRoutes from "./routes/savedRequests.js";
import apiLogsRoutes from "./routes/apiLogs.js";
import interceptorRulesRoutes from "./routes/interceptorRules.js";
import workspacesRoutes from "./routes/workspaces.js";
import settingsRoutes from "./routes/settings.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware (configured for CORS)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// Logging & Performance
app.use(morgan("dev"));
app.use(compression());

// CORS configuration
app.use(
  cors({
    origin: [
      "https://flux-port.vercel.app",
      "http://localhost:3000",
      "http://localhost:3002",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Handle preflight requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://flux-port.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionsRoutes);
app.use("/api/folders", foldersRoutes);
app.use("/api/saved-requests", savedRequestsRoutes);
app.use("/api/api-logs", apiLogsRoutes);
app.use("/api/interceptor-rules", interceptorRulesRoutes);
app.use("/api/workspaces", workspacesRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/api/health", async (req, res) => {
  const startedAt = Date.now();
  try {
    // Warm Postgres/Neon pool too (lightweight query).
    await pool.query("SELECT 1 as ok");
    res.json({
      status: "ok",
      message: "FluxPort Backend API",
      db: "connected",
      ms: Date.now() - startedAt,
    });
  } catch (err) {
    res.status(503).json({
      status: "error",
      message: "Health check failed",
      db: "unavailable",
      ms: Date.now() - startedAt,
      // Avoid leaking secrets; only send safe error text.
      error: err?.message ? String(err.message) : "unknown",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
