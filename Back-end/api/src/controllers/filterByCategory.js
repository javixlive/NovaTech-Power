const { Products, Categories, Proveedores } = require("../db.js");
const { Op } = require("sequelize");

const productsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const filterCategories = await Products.findAll({
      where: { status: { [Op.eq]: 1 } },
      include: {
        model: Categories,
        attributes: ["name"],
        through: { attributes: [] },
        where: {
          name: category,
        },
      },
    });

    filterCategories.length
      ? res.status(200).json({ Status: "Success", filterCategories })
      : res.status(400).json({
          Status: "Error",
          Message: "There are no products in the selected category.",
        });
  } catch (error) {
    res.status(500).json(error);
  }
};
module.exports = { productsByCategory };
