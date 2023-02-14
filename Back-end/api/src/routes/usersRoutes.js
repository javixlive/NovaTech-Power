const { Router } = require("express");
const router = Router();
const {
  allUsers,
  oneUser,
  statusCero,
  deleteUser,
  restoreUser,
  updateUser,
  pageCurrentOne,
  pageCurrentCero,
  rootUser,
} = require("../controllers/usersController");
const { changePassword } = require("../controllers/passwordController");
const fileupload = require("express-fileupload");

router.post("/password", changePassword);
router.get("/", allUsers);
router.get("/status", statusCero);
router.get("/:id", oneUser);
router.get("/page/:id", pageCurrentOne);
router.get("/page0/:id", pageCurrentCero);
router.delete("/:id", deleteUser);
router.put("/restore/:id", restoreUser);
router.put(
  "/:id",
  fileupload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  updateUser
);
router.put("/root/user", rootUser);

module.exports = router;
