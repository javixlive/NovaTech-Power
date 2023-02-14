const { Products, Categories, Proveedores } = require("../db");
const { Op } = require("sequelize");

const search = async (req, res) => {
  const { value } = req.params;
  try {
    const searchP = await Products.findAll({
      include: [
        {
          model: Categories,
          attributes: ["name"],
        },
        {
          model: Proveedores,
          attributes: ["provider"],
        },
      ],
      where: {
        [Op.and]: [{ name: { [Op.iLike]: "%" + value + "%" } }, { status: 1 }],
      },
    });
    if (searchP.length) {
      return res.status(200).json(searchP);
    } else {
      return res.status(400).send("unmatch search");
    }
  } catch (error) {
    return res.status(400).send("search failed");
  }
};

module.exports = { search };
