const { Router } = require("express");
const {
  createNotification,
  deleteNotification,
  getNotifications,
} = require("../controllers/createNotification.js");
const router = Router();

router.post("/", createNotification);
router.delete("/", deleteNotification);
router.get("/", getNotifications);
module.exports = router;
