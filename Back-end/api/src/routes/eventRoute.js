const { Router } = require("express");
const {
  createEvent,
  getEvents,
  deleteEvent,
} = require("../controllers/calendarController");

const router = Router();

router.post("/", createEvent);
router.get("/", getEvents);
router.delete("/:id", deleteEvent);
module.exports = router;
