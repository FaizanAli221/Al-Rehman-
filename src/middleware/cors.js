/**
 * CORS configuration. Reads an optional comma-separated allow-list from
 * the ALLOWED_ORIGINS env var (e.g. "https://alrehmanbiryani.com.pk,https://staging.example.com").
 * Falls back to allowing all origins, which is fine for a public read-mostly
 * menu API but should be tightened for production if you add auth/cookies.
 */
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = { corsOptions };
