const { Router } = require("express");
const authRoutes = require("./auth");
const addressRoutes = require("./address");

const router = Router();

router.use("/auth", authRoutes);
router.use("/address", addressRoutes);
router.get("/ping", (req, res) => {
  res.json({ message: "PONG" });
});
router.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

module.exports = router;
