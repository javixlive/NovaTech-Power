const { Router } = require("express");
const router = Router();
const { productsByCategory } = require("../controllers/filterByCategory.js");

router.get("/:category", productsByCategory);

module.exports = router;
