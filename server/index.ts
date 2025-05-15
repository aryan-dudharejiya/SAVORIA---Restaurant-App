import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ Enable gzip compression
app.use(compression());

// ✅ Parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Request logging for API routes
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = createServer(app);

  // ✅ Register backend routes
  await registerRoutes(app);

  // ✅ Production: Serve static files from client build
  if (app.get("env") === "development") {
    await setupVite(app, server); // Only use Vite dev server in dev
  } else {
    serveStatic(app);

    // ✅ SPA fallback for React Router (if needed)
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "../client/index.html"));
    });
  }

  // ✅ Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    log(`❌ Error: ${message}`);
  });

  // ✅ Tune keep-alive and listen
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;

  const port = process.env.PORT || 8000;
  server.listen(port, "0.0.0.0", () => {
    log(`🚀 Server running on port ${port}`);
  });
})();
