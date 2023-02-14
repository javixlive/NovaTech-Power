const { Products, Series } = require("../db");
const { Op } = require("sequelize");
const stockProduct = async (productId) => {
  try {
    const findProduct = await Products.findByPk(productId);
    const stock = await Series.count({
      where: { [Op.and]: [{ productId }, { status: { [Op.eq]: 1 } }] },
    });

    await findProduct.update({ stock, status: 1 });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
const addSerieProduct = async (req, res) => {
  const { serie, productId } = req.body;
  console.log(serie, productId);
  try {
    const findProduct = await Products.findByPk(productId);
    console.log(findProduct);
    const newSerie = await Series.create({
      serie,
    });
    await findProduct.addSeries(newSerie);
    const response = await stockProduct(productId);

    response
      ? res.status(200).json({
          status: "success",
          msg: "Serie agregada correctamente!",
          newSerie,
        })
      : res.stauts(500).send("error!");
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ status: "error", msg: "No se han agregado las series!" });
  }
};

const getSeries = async (req, res) => {
  const { productId } = req.params;
  try {
    const findSeries = await Series.findAll({ where: { productId } });
    return res.status(200).json(findSeries);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

const deleteSerie = async (req, res) => {
  const { serieId } = req.params;
  try {
    const findSerie = await Series.findByPk(serieId);
    await findSerie.update({ status: 0 });
    const response = await stockProduct(findSerie.productId);
    response
      ? res.status(200).json(findSerie)
      : res.status(500).send("Error al actualizar el stock de producto");
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};
const restoreSerie = async (req, res) => {
  const { serieId } = req.params;
  try {
    const findSerie = await Series.findByPk(serieId);
    await findSerie.update({ status: 1 });
    const response = await stockProduct(findSerie.productId);
    response
      ? res.status(200).json(findSerie)
      : res.status(500).send("Error al actualizar el stock de producto");
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};
module.exports = {
  addSerieProduct,
  getSeries,
  deleteSerie,
  restoreSerie,
};
