const { Router } = require("express");
const {
  getProducts,
  statusCero,
  postProducts,
  productsId,
  deleteProducts,
  restoreProducts,
  updateProducts,
  pageCurrent,
  sortProducts,
  popularProducts,
  pageStatusCero,
} = require("../controllers/productsController");
const fileupload = require("express-fileupload");
const router = Router();

router.get("/", getProducts);
router.get("/status", statusCero);
router.get("/:id", productsId);
router.post(
  "/",
  fileupload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  postProducts
);
router.delete("/:id", deleteProducts);
router.put("/restore/:id", restoreProducts);
router.put(
  "/:id",
  fileupload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  updateProducts
);
router.get("/page/:id", pageCurrent);
router.get("/sort/:id", sortProducts);
router.get("/other/popular", popularProducts);
router.get("/page0/:id",pageStatusCero);

module.exports = router;
