const { Router } = require("express");
const {
  addSerieProduct,
  getSeries,
  deleteSerie,
  restoreSerie,
} = require("../controllers/seriesController");
const router = Router();

router.post("/", addSerieProduct);
router.get("/:productId", getSeries);
router.delete("/:serieId", deleteSerie);
router.put("/restore/:serieId", restoreSerie);

module.exports = router;
