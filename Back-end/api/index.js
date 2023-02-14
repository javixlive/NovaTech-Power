
const { server } = require("./src/app.js");
require("dotenv").config;
const { PORT } = process.env;
const { conn } = require("./src/db.js");
const {
  createRoles,
  createCategories,
  createProviders,
  createBrands,
} = require("./src/middlewares/initServer.js");
//TODO: SOCKET
const socket = require("./src/socket/socket.js");

socket();

//TODO: SOCKET

server.listen(PORT, () => {
  console.log(`%s listening at ${PORT}`);

  try {
    conn
      .sync({ force: false })
      .then((response) => {
        createRoles();
        createCategories();
        createProviders();
        createBrands();
      })
      .catch((e) => {
        console.log(e);
      });
  } catch (e) {
    console.log("Error!!");
  }
});
