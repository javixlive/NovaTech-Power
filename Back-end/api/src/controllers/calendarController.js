const sequelize = require("../db");
const { Events } = sequelize;

const createEvent = async (req, res) => {
  const { title, date } = req.body;
  try {
    const newEvent = await Events.create({ title, date });
    return res.status(200).json(newEvent);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

const getEvents = async (req, res) => {
  try {
    const findEvents = await Events.findAll({
      attributes: ["id", "title", "date"],
    });
    return res.status(200).json(findEvents);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    await Events.destroy({ where: { id } });
    return res.status(200).send("Event remove!");
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};
module.exports = { createEvent, getEvents, deleteEvent };
