const { Router } = require("express");
const router = Router();
const { search } = require("../controllers/searchController.js");

router.get("/:value", search);

module.exports = router;
