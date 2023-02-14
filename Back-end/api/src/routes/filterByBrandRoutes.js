const { Router } = require("express");
const router = Router();
const { productsByBrand } = require("../controllers/filterByBrand");

router.get("/:brand", productsByBrand);

module.exports = router;
