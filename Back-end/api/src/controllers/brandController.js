const { Brands } = require("../db.js");

const getBrands = async (req, res) => {
  try {
    const findBrands = await Brands.findAll();
    return res.status(200).json(findBrands);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: "error", msg: "No existen datos!" });
  }
};
module.exports = { getBrands };
