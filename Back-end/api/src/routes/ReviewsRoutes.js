const { Router } = require("express");
const { getReviews } = require("../controllers/reviewController");
const {
  saveReview,
  validateRating,
} = require("../controllers/reviewController");
const router = Router();

router.post("/", saveReview);
router.put("/", validateRating);
router.get("/product/:productId", getReviews);

module.exports = router;
