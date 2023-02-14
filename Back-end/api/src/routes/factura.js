const { Router } = require("express");
const {
  createFactura,
  geTfacturas,
  getAllFacturas,
  getFacturaDetail,
  getFilePdf,
} = require("../controllers/facturaController");
const router = Router();

router.post("/", createFactura);
router.get("/all", getAllFacturas);
router.get("/user/:userId", geTfacturas);
router.get("/detail/:facturaId", getFacturaDetail);
router.post("/factura/pdf", getFilePdf);

module.exports = router;
