const { Products, Categories, Proveedores } = require("../db.js");

const productsByBrand = async (req, res) => {
  const { brand } = req.params;
  try {
    const filterBrands = await Products.findAll({
      include: [
        {
          model: Categories,
          attributes: ["name"],
        },
        {
          model: Proveedores,
          attributes: ["proveedor"],
        },
      ],
      where: {
        marca: brand,
        status: 1,
      },
    });

    filterBrands.length
      ? res.status(200).json({ Status: "Success", filterBrands })
      : res.status(400).json({
          Status: "Error",
          Message: "There are no products in the selected brand.",
        });
  } catch (error) {
    res.status(500).json(error);
  }
};
module.exports = { productsByBrand };
