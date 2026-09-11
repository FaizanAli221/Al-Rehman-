const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { corsOptions } = require("../src/middleware/cors");
const { notFound, errorHandler } = require("../src/middleware/errorHandler");
const menuRoutes = require("../src/routes/menu");
const orderRoutes = require("../src/routes/order");
const pkg = require("../package.json");

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "50kb" }));

// -- System & health -----------------------------------------------------
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: pkg.version,
  });
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    name: "Al Rehman Biryani API",
    version: pkg.version,
    endpoints: [
      "GET  /api/health",
      "GET  /api/categories",
      "GET  /api/products",
      "GET  /api/products/:id",
      "POST /api/orders/calculate",
      "POST /api/orders/whatsapp",
    ],
  });
});

// -- Feature routes --------------------------------------------------------
app.use("/api", menuRoutes);
app.use("/api/orders", orderRoutes);

// -- Serve built frontend static files if present -------------------
const path = require("path");
const fs = require("fs");

const distPath = path.join(__dirname, "..", "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// -- Fallbacks ---------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

// Local development: `node api/index.js`
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Al Rehman Biryani API listening on http://localhost:${PORT}`);
  });
}

// Vercel serverless export — an Express app is a valid (req, res) handler.
module.exports = app;
