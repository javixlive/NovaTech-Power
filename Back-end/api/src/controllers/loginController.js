const { Users, Roles } = require("../db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


async function login(req, res) {
  let { email, password } = req.body;

  try {
    let validEmail = await Users.findOne({
      where: { email },
      include: {
        model: Roles,
        attributes: ["rol"],
        // through: { attributes: [] },
      },
    });
    if (!validEmail)
      return res.status(400).json({ error: "email is not registered" });

    let validPassword = await bcrypt.compare(password, validEmail.password);
    if (!validPassword)
      return res.status(400).json({ error: "password incorrect" });

    let token = jwt.sign(
      {
        //creo token
        id: validEmail.id,
        name: validEmail.userName,
        role: validEmail.role,
      },
      process.env.TOKEN
    );
    res
      .status(200)
      .json({ meesage: "Correctly Login", ...validEmail.dataValues, token });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

module.exports = { login };
