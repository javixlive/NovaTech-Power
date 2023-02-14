const sequelize = require("../db");
const { Router } = require("express");
const router = Router();

const { Users } = sequelize;
const {
  createProductsInCart,
  getCart,
  updateCart,
  deleteProduct,
} = require("../controllers/cartController");

router.post("/:productId", async (req, res) => {
  const { userId, quantity } = req.body;
  const { productId } = req.params;

  try {
    const user = await Users.findByPk(userId);
    const productsInCart = await createProductsInCart(
      quantity,
      productId,
      user.cartId
    );
    console.log(productsInCart);
    productsInCart
      ? res
          .status(200)
          .json({ status: "success", msg: "Producto agregado correctamente!" })
      : res.status(400).json({
          status: "error",
          msg: "El producto ya existe en el carrito!",
        });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

//TODO:
router.get("/:userId", getCart);
router.put("/", updateCart);
router.delete("/:productId/:cartId", deleteProduct);
module.exports = router;
//TODO:
