const sequelize = require("../db");
const { Carts, ProductsInCart, Users, Products } = sequelize;
const { Op } = require("sequelize");

const getCart = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    if (userId) {
      await Users.findByPk(userId)
        .then(async (user) => {
          console.log(user);
          user
            ? await Carts.findOne({
                where: {
                  [Op.and]: [
                    { id: user.cartId },
                    { status: { [Op.eq]: "pending" } },
                  ],
                },
              }).then(async (Carts) => {
                console.log(Carts);
                await ProductsInCart.findAll({
                  where: {
                    cartId: Carts.id,
                  },
                  include: Products,
                })
                  .then((products) => {
                    console.log(products);
                    return res.status(200).json({
                      status: "success",
                      cart: { ...Carts.dataValues, products },
                    });
                  })
                  .catch((e) => {
                    console.log(e);
                    return res.status(500).json({ status: "error", msg: e });
                  });
              })
            : res.status(404).json({ status: "error", msg: "No user found!" });
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json({ status: "error", msg: e });
        });
    } else {
      return res
        .status(400)
        .json({ status: "error", msg: "UserID igual a undefined!" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ stauts: "error", msg: e });
  }
};

const createProductsInCart = async (quantity, productId, cartId) => {
  console.log(quantity, cartId, productId);
  const findProduct = await ProductsInCart.findOne({
    where: { cartId },
    include: {
      model: Products,
      where: {
        id: productId,
      },
    },
  });
  console.log(findProduct);
  if (!findProduct) {
    try {
      const productsInCart = await ProductsInCart.create({
        quantity,
        productId,
      });
      const cart = await Carts.findByPk(cartId);
      const sumatotal = parseFloat(cart.totalPrice);
      const product = await Products.findByPk(productId);

      console.log(sumatotal);
      await cart.addProductsInCarts(productsInCart);
      const priceCart = await Carts.update(
        {
          totalPrice:
            sumatotal + parseFloat(product.price) * parseInt(quantity),
        },
        { where: { id: cartId } }
      );
      console.log(priceCart);
      return true;
    } catch (e) {
      return e;
    }
  } else {
    return false;
  }
};

const updateCart = async (req, res) => {
  const { productId, quantity, userId } = req.body;
  console.log(productId, quantity);
  console.log(userId);
  if (userId) {
    try {
      const user = await Users.findByPk(userId);
      if (user) {
        const cart = await Carts.findOne({
          where: {
            [Op.and]: [{ id: user.cartId }, { status: { [Op.eq]: "pending" } }],
          },
        });
        const products = await ProductsInCart.findAll({
          where: {
            cartId: cart.id,
          },
          include: Products,
        });
        console.log(products);
        const updateProduct = await ProductsInCart.findOne({
          where: {
            [Op.and]: [
              { cartId: { [Op.eq]: cart.id } },
              { productId: { [Op.eq]: productId } },
            ],
          },
          include: Products,
        });
        const sumatotal =
          cart.totalPrice -
          updateProduct.product.price * updateProduct.quantity;
        await updateProduct
          .update({ quantity })
          .then(async (response) => {
            console.log("Se edito correctamente");
            await cart
              .update({
                totalPrice: sumatotal + updateProduct.product.price * quantity,
              })
              .then((response) => {
                console.log(
                  "new Price:",
                  sumatotal + updateProduct.product.price * quantity
                );
              })
              .catch((response) => {
                console.log("CUELGATE!", response);
              });
          })
          .catch((e) => {
            console.log("Error", e);
          });
        return res.status(200).json({
          status: "success",
          user,
          cart,
          products,
          updateProduct,
          price: sumatotal,
        });
      } else {
        return res
          .status(400)
          .json({ status: "error", msg: "No existe el usuario!" });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({ status: "error", msg: e });
    }
  } else {
    return res
      .status(400)
      .json({ status: "error", msg: "UserID igual a undefined!" });
  }
};
const deleteProduct = async (req, res) => {
  const { productId, cartId } = req.params;
  console.log(productId, cartId, req.params);
  try {
    const cart = await Carts.findByPk(cartId);
    const product = await ProductsInCart.findOne({
      where: {
        [Op.and]: [
          { cartId: { [Op.eq]: cart.id } },
          { productId: { [Op.eq]: productId } },
        ],
      },
      include: Products,
    });
    console.log(product);
    await ProductsInCart.destroy({
      where: { [Op.and]: [{ cartId }, { productId }] },
    })
      .then((response) => {
        console.log(response);
        const totalPrice =
          cart.totalPrice - product.product.price * product.quantity;
        console.log(totalPrice);
        cart.update({ totalPrice });
        return res.status(200).json({
          status: "success",
          msg: "Producto eliminado correctamente!",
        });
      })
      .catch((e) => {
        console.log(e);
        return res.status(400).json({ status: "error", msg: e });
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

module.exports = {
  getCart,
  createProductsInCart,
  updateCart,
  deleteProduct,
};
