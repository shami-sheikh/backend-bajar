require("dotenv").config();
const db = require("./utils/database");
const cors=require("cors")
const express = require("express");
const authRouter = require("./routers/auth-router");
const contactRouter=require("./routers/contact-router")
const serviceRouter=require("./routers/service-router")
const adminRouter = require("./routers/admin-router")
//for adding image path
const path = require("path")
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).send("welcome to bajarstack");
});
app.use("/auth/api", authRouter);
app.use("/auth/form",contactRouter)
app.use("/auth/data",serviceRouter);
// for admin routers 
app.use("/auth/user", adminRouter)
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

const port = process.env.PORT || 5000;
db()
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });
