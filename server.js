require("dotenv").config();
const db = require("./utils/database");
const cors = require("cors");
const express = require("express");
const authRouter = require("./routers/auth-router");
const contactRouter = require("./routers/contact-router");
const serviceRouter = require("./routers/service-router");
const adminRouter = require("./routers/admin-router");
//for adding image path
const path = require("path");
const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://localhost:5000",
    "https://frontend-bajar.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials:true
}));
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).send("welcome to bajarstack");
});
app.use("/auth/api", authRouter);
app.use("/auth/form", contactRouter);
app.use("/auth/data", serviceRouter);
// for admin routers
app.use("/auth/user", adminRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve frontend static build (if present)
const frontendDist = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDist));
// Fallback: serve index.html for non-API GET requests (single-page app)
app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  const isApi = req.path.startsWith("/auth") || req.path.startsWith("/api") || req.path.startsWith("/uploads");
  if (isApi) return next();
  res.sendFile(path.join(frontendDist, "index.html"));
});

const port = process.env.PORT || 5000;
db()
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });
