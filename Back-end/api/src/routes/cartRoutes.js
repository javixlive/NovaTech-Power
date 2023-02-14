const { Router } = require("express");
const {
  getCart,
  createProductsInCart,
} = require("../controllers/cartController.js");

const router = Router();

router.get("/:userId", getCart);
router.post("/", createProductsInCart);

module.exports = router;
