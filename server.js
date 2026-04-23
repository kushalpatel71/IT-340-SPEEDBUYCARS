require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const requestLogger = require("./middleware/requestLogger");

const authRoutes = require("./routes/authRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const sellCarRoutes = require("./routes/sellCarRoutes");

const app = express();

connectDB();

/* trust proxy if you later put nginx/security VM in front */
app.set("trust proxy", 1);

/* rate limiters */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // max 100 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." }
});
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 5, // max 5 auth requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Try again later." }
});

app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "http://192.168.165.136:4200",
      "http://192.168.79.146:4200",
      "http://192.168.165.136",
      "http://192.168.79.146"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: false
  })
);

app.use(express.json());
app.use(requestLogger);

/* apply rate limits before routes */
app.use("/api/", generalLimiter);
app.use("/api/auth/", authLimiter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SpeedBuyCars backend is running."
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/quote", quoteRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/sellcar", sellCarRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
