const { Router } = require("express");
const router = Router();
const { register } = require("../controllers/registerController.js");
const fileupload = require("express-fileupload");

router.post(
  "/",
  fileupload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  register
);

module.exports = router;
