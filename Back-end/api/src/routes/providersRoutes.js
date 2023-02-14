const { Router } = require("express");
const router = Router();
const {
  getAllProviders,
  createProvider,
  updateProvider,
  deleteProvider,
} = require("../controllers/providersController.js");

router.get("/", getAllProviders);
router.post("/", createProvider);
router.put("/:id", updateProvider);
router.delete("/:id", deleteProvider);

module.exports = router;
