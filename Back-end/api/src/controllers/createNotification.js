const { Notifications, Users } = require("../db");

const createNotification = async (data) => {
  const { type, notify } = JSON.parse(data);
  try {
    const newNotification = await Notifications.create({ type, notify });
    const findNotifications = await Notifications.findAll({
      where: { status: 1 },
    });
    return { findNotifications, newNotification };
  } catch (e) {
    return e;
  }
};

const deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    await Notifications.update({ status: 0 }, { where: { status: 1 } });
    return res.status(200).send("Notificaciones eliminadas");
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

const getNotifications = async (req, res) => {
  try {
    const findNotifications = await Notifications.findAll({
      where: { status: 1 },
    });
    return res.status(200).json(findNotifications);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ e });
  }
};
module.exports = { createNotification, getNotifications, deleteNotification };
