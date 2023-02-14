const sequelize = require("../db");
const { Carts, ProductsInCart, Users, Products, Facturas } = sequelize;
const { Op } = require("sequelize");
const pdfMake = require("pdfmake/build/pdfmake.js");
const pdfFonts = require("pdfmake/build/vfs_fonts.js");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const createFactura = async (req, res) => {
  const { paymentId, userId, country, city, address } = req.body;
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
              }).then(async (cart) => {
                console.log(cart);
                await ProductsInCart.findAll({
                  where: {
                    cartId: { [Op.eq]: cart.id },
                  },
                  // include: { model: Products },
                })
                  .then(async (products) => {
                    console.log(products);
                    try {
                      const newFactura = await Facturas.create({
                        paymentId,
                        cartId: cart.id,
                        total: cart.totalPrice,
                        country,
                        address,
                        city,
                      });
                      await newFactura.addProductsInCarts(products);
                      await user.addFacturas(newFactura);
                      console.log({ newFactura });
                      await cart
                        .update({ status: "success" })
                        .then((response) => {
                          console.log(response);
                        })
                        .catch((e) => {
                          console.log(e);
                        });
                      const newCart = await Carts.create({ totalPrice: 0 });
                      const userUpdate = await user.update({
                        cartId: newCart.id,
                      });

                      return res.status(200).json({
                        status: "success",
                        data: {
                          factura: { ...newFactura.dataValues },
                          cart: { ...cart.dataValues },
                          products: { ...products.dataValues },
                          user: { ...userUpdate.dataValues },
                        },
                      });
                    } catch (e) {
                      console.log(e);
                      return res.status(500).json({ status: "error", msg: e });
                    }
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
    res.status(500).json({ status: "error", msg: e });
  }
};

const geTfacturas = async (req, res) => {
  const { userId } = req.params;

  try {
    const findFacturas = await Facturas.findAll({ where: { userId } });
    console.log(findFacturas);
    return res.status(200).json(findFacturas);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ e });
  }
};

const getAllFacturas = async (req, res) => {
  try {
    const findFacturas = await Facturas.findAll();
    console.log(findFacturas);
    return res.status(200).json(findFacturas);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ e });
  }
};

const getFacturaDetail = async (req, res) => {
  const { facturaId } = req.params;
  try {
    const findFacturas = await Facturas.findOne({
      where: { id: facturaId },
    });

    const findProducts = await ProductsInCart.findAll({
      where: { facturaId },
      include: { model: Products },
    });
    console.log(findFacturas);
    return res.status(200).json({ findFacturas, findProducts });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ e });
  }
};

const getFilePdf = async (req, res) => {
  const { file, facturaId } = req.body;
  try {
    if (!file) return res.status(500).send("Error!");
    const image = new Image();
    image.src = file;

    const doc = {
      content: [{ image }],
    };

    const pdf = await pdfMake.createPdf(doc);
    pdf.getBase64((encoded) => {
      res.contentType("application/pdf");
      res.send(Buffer.from(encoded, "base64"));
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

module.exports = {
  createFactura,
  geTfacturas,
  getAllFacturas,
  getFacturaDetail,
  getFilePdf,
};
