const { Op } = require("sequelize");
const { Reviews, Users, Products } = require("../db");

const calculateRating = async (productId, userId) => {
  //TODO:RATING USUARIOS
  try {
    const usuarios = await Reviews.count({
      where: { productId },
    });
    const suma = await Reviews.sum("rating", { where: { productId } });
    //TODO:CALCULATE
    let result = suma / usuarios;
    if (result > 5) return 5;
    return suma / usuarios;
  } catch (e) {
    return e;
  }
};

const validateRating = async (req, res) => {
  const { productId, userId } = req.body;
  try {
    const findReview = await Reviews.findOne({
      where: { [Op.and]: [{ productId }, { userId }] },
    });
    findReview
      ? res.status(200).json(findReview)
      : res.status(500).send("No existe reseña!");
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

const saveReview = async (req, res) => {
  const { userId, productId, rating, review } = req.body;
  //TODO:
  try {
    const newReview = await Reviews.create({
      rating,
      review,
      userId,
      productId,
    });
    const findProduct = await Products.findByPk(productId);

    console.log(newReview, findProduct.rating);
    //TODO: Calcular rating formula: E(rating del product)/cantidad de usuarios
    const suma = await calculateRating(productId, userId);
    await findProduct.update({ rating: suma });

    res.status(200).json({ status: "success", newReview, findProduct, suma });
  } catch (e) {
    console.log(e);
    res.status(500).send("Error");
  }
};

const getReviews = async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await Reviews.findAll({
      where: { productId },
      include: {
        model: Users,
        attributes: ["firstName", "lastName", "avatar"],
      },
    });
    return res.status(200).json(reviews);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

module.exports = { saveReview, validateRating, getReviews };
