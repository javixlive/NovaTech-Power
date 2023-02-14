const { Router } = require("express");
const router = Router();
const {
  getAllCategories,
  createCategories,
  updateCategories,
  deleteCategories,
} = require("../controllers/categoriesController.js");

router.get("/", getAllCategories);
router.post("/", createCategories);
router.put("/:id", updateCategories);
router.delete("/:id", deleteCategories);

module.exports = router;
