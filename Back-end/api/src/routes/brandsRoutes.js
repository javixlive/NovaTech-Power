const { Router } = require("express");
const { getBrands } = require("../controllers/brandController");

const router = Router();

router.get("/", getBrands);

module.exports = router;
