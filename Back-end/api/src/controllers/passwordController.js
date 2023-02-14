const { Users } = require("../db.js");
const bcrypt = require("bcrypt");

async function changePassword(req, res) {
  let { email, password, newPassword, confirmPassword } = req.body;

  try {
    let validEmail = await Users.findOne({ where: { email: email } });

    let comparePassword = await bcrypt.compare(password, validEmail.password);

    if (!comparePassword) {
      res.status(400).json({ message: "El password no es igual" });
    } else if (newPassword) {
      if (password === newPassword) {
        res
          .status(400)
          .json({ message: "El password viejo y el nuevo son iguales" });
      }
    }
    if (confirmPassword !== newPassword) {
      res.status(400).json({ message: "No son iguales" });
    } else {
      const salt = await bcrypt.genSalt(10);
      let passwordUpdate = validEmail.update({
        password: await bcrypt.hash(newPassword, salt),
      });

      return res.status(200).json({ message: "Password Updated" });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
}

module.exports = { changePassword };
