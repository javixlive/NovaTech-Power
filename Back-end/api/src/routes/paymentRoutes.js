const { Router } = require("express");
const router = Router();

const { createOrder, captureOrder, cancelOrder} = require("../controllers/paymentContoller");

router.post("/create-order", createOrder);
router.get("/capture-order", captureOrder);
router.get("/cancel-order", cancelOrder);

module.exports = router;