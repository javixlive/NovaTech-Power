const { Messages, Users } = require("../db.js");

const createMessage = async (userName, messageContent) => {
  try {
    const user = await Users.findOne({
      where: {
        userName: userName,
      },
    });
   
    const message = await Messages.create({
      content: messageContent,
      userId: user.id,
      
    });  
    return {
      userName: userName,
      message: message.content,
      createdAt:message.createdAt,
    };
  } catch (error) {
    console.log(error);
  }
};

const getMessages = async () => {
  try {
    const messages = await Messages.findAll({
      order: [['createdAt', 'ASC']],
      include: {
        model: Users,
        attributes: ["userName", "avatar","createdAt"],
        /* through: {
          attributes: [],
        }, */
      },
    });
    /* console.log('a ver que sake',messages); */
    return messages;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { createMessage, getMessages };
