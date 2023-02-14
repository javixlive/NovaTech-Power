const { Users, Carts, Roles } = require("../db.js");
const jwt = require("jsonwebtoken"); //token
const bcrypt = require("bcrypt"); //hash
const fs = require("fs-extra");
const { uploadAvatarImage } = require("../middlewares/cloudinary.js");
const { transporter } = require("../middlewares/nodeMailer");

async function register(req, res) {
  let {
    avatar,
    firstName,
    lastName,
    birthday,
    userName,
    email,
    password,
    country,
    phone,
    rol,
  } = req.body;

  function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }
  let code = getRandomInt(100000, 999999);
  let text = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div style="background-color: black;color: white;width: 650px;height: 550px;display: flex;justify-content: center;align-items: center;flex-direction: column;padding: 20px;">
        <div><h1>${firstName}:</h1></div>
        <div><b>your verificarion code is: ${code}</b></div>
       <img style="width: 480;height: 400px;" src=" https://res.cloudinary.com/debfwgutb/image/upload/v1675434666/BoxTech.png"/>
        <div><a style="color:gray" href="https://henrytech.vercel.app/home">click para ir a la tienda</a></div>
    </div>
</body>
</html>`;
  async function mail(email, code) {
    let info = await transporter.sendMail({
      from: '"Boxtech" <account@boxtech.com>',
      to: email, // receivers
      subject: "Boxtech", // Subject line
      text: "verification code!!!", // plain text body
      html: text, // html body
    });
  }

  try {
    let findUserName = await Users.findOne({ where: { userName } });
    let findEmail = await Users.findOne({ where: { email } });

    if (findUserName)
      return res.status(400).json(`the username ${userName} is registered`);
    if (findEmail)
      return res.status(400).json(`the email ${email} is registered`);

    if (req.files?.avatar) {
      try {
        const newCart = await Carts.create({
          totalPrice: 0,
        });

        const avatarImg = await uploadAvatarImage(
          req.files.avatar.tempFilePath
        );

        if (rol) {
          let findRole = await Roles.findOne({ where: { rol } });

          let newUser = await Users.create({
            avatar: avatarImg.secure_url,
            avatarId: avatarImg.public_id,
            firstName: firstName,
            lastName: lastName,
            birthday: birthday,
            userName: userName,
            email: email,
            password: await bcrypt.hash(password, 10),
            country,
            phone,
            cartId: newCart.id,
            verifCode: code,
          });

          await fs.unlink(req.files.avatar.tempFilePath);

          await newUser.setRole(findRole);

          let token = jwt.sign(
            {
              //creo token
              id: newUser.cartId,
              name: userName,
              role: rol,
            },
            process.env.TOKEN
          );

          mail(newUser.email, newUser.verifCode);

          res.status(200).json({
            message: "Succefully registered",
            ...newUser.dataValues,
            token,
          });
        } else {
          let userRole = await Roles.findOne({ where: { rol: "User" } });
          let newUser = await Users.create({
            avatar: avatarImg.secure_url,
            avatarId: avatarImg.public_id,
            firstName: firstName,
            lastName: lastName,
            birthday: birthday,
            userName: userName,
            email: email,
            password: await bcrypt.hash(password, 10),
            country,
            phone,
            cartId: newCart.id,
            verifCode: code,
          });

          await fs.unlink(req.files.avatar.tempFilePath);

          await newUser.setRole(userRole);

          let token = jwt.sign(
            {
              //creo token
              id: newUser.cartId,
              name: userName,
              role: rol,
            },
            process.env.TOKEN
          );

          mail(newUser.email, newUser.verifCode);
          res.status(200).json({
            message: "Succefully registered",
            ...newUser.dataValues,
            token,
          });
        }
      } catch (error) {
        res.status(400).json({ message: error });
      }
    } else {
      const newCart = await Carts.create({
        totalPrice: 0,
      });

      if (rol) {
        let findRole = await Roles.findOne({ where: { rol } });

        let newUser = await Users.create({
          firstName: firstName,
          lastName: lastName,
          birthday: birthday,
          userName: userName,
          email: email,
          password: await bcrypt.hash(password, 10),
          country,
          phone,
          cartId: newCart.id,
          verifCode: code,
        });

        await newUser.setRole(findRole);

        let token = jwt.sign(
          {
            //creo token
            id: newUser.cartId,
            name: userName,
            role: rol,
          },
          process.env.TOKEN
        );

        mail(newUser.email, newUser.verifCode);

        res.status(200).json({
          message: "Succefully registered",
          ...newUser.dataValues,
          token,
          rol: findRole.rol,
        });
      } else {
        let userRole = await Roles.findOne({ where: { rol: "User" } });
        console.log(userRole);
        let newUser = await Users.create({
          avatar,
          firstName: firstName,
          lastName: lastName,
          birthday: birthday,
          userName: userName,
          email: email,
          password: await bcrypt.hash(password, 10),
          country,
          phone,
          cartId: newCart.id,
          verifCode: code,
        });

        await newUser.setRole(userRole);

        let token = jwt.sign(
          {
            //creo token
            id: newUser.cartId,
            name: userName,
            role: rol,
          },
          process.env.TOKEN
        );

        mail(newUser.email, newUser.verifCode);

        res.status(200).json({
          message: "Succefully registered",
          ...newUser.dataValues,
          rol: userRole.rol,
          token,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
}

module.exports = { register };
