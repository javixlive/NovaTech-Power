const { io } = require("../app");
const { createNotification } = require("../controllers/createNotification");
const {
  getDataSold,
  sumUsers,
  getDataProductsSold,
} = require("../controllers/dashboardController");
const {
  createMessage,
  getMessages,
} = require("../controllers/messageController");

/* let connectedUsers = []; */
const socket = () => {
  io.on("connection", (socket) => {
    console.log(socket.id, "conectado");
    socket.on("notification", async (data) => {
      console.log(data);
      const response = await createNotification(data);
      console.log(response);
      socket.broadcast.emit("notification", response);
    });
    socket.on("message", async (data) => {
      const { user, content, createdAt } = data;
      const { userName } = user;
      const message = await createMessage(userName, content, createdAt);
      socket.broadcast.emit("message", data);
    });

    /* connectedUsers.push(socket.id);
socket.on("user connected", connectedUsers);
socket.broadcast.emit("user connected", connectedUsers);


socket.on("disconnect", () => {
  connectedUsers = connectedUsers.filter(user => user !== socket.id);
  socket.broadcast.emit("user connected", connectedUsers);
}); */
    let users = new Array();
    socket.on("get messages", async () => {
      const messages = await getMessages();
      if (messages.length > 0) {
        socket.emit("get messages", messages);
      }
    });
    socket.on("getDataSold", async () => {
      const promedio = await getDataSold();
      socket.emit("DataSold", promedio);
    });
    socket.on("sendDataSold", async () => {
      const promedio = await getDataSold();
      socket.broadcast.emit("DataSold", promedio);
    });
    socket.on("getSumUsers", async () => {
      const users = await sumUsers();
      socket.emit("sumUsers", users);
    });
    socket.on("sendSumUsers", async () => {
      const users = await sumUsers();
      socket.broadcast.emit("sumUsers", users);
    });
    socket.on("getProductSold", async () => {
      const data = await getDataProductsSold();
      socket.emit("getProductSold", data);
    });
    socket.on("sendProductSold", async () => {
      const data = await getDataProductsSold();
      socket.broadcast.emit("getProductSold", data);
    });
    //------------------------------------------------------------------------------
    //TODO: USUARIOS CONECTADOS {userName, avatar}
    socket.on("userConnect", (data) => {
      users.push(data);
      socket.broadcast.emit("getUserConnect", data);
    });
    socket.on("userOff", (data) => {
      users = users.filter((u) => u.userName !== data);
      socket.broadcast.emit("getUserOff", data);
    });
    //-------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------
    //TODO: USUARIOS CONECTADOS
    //TODO: MENSAJES PRIVADOS {userName, avatar} socket.emit("PRIVATE",{userName=remitente,avatar,content})
    //TODO: FRONT: socket.on(userName=localstorage,data=>{setMessagePrivate([...messagePrivate,data])})
    //TODO: lista de usuarios avatar = logo de la pagina, nombnre NovaTech => chatGrupal
    //-------------------------------------------------------------------------------------------------------
    socket.on("PRIVATE", (data) => {
      socket.broadcast.emit(data.userName, data);
    });
    //TODO: MENSAJES PRIVADOS
  });
};

//TODO:LISTEN CONNECTIONS
module.exports = socket;
