const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "events",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      timestamp: true,
      paranoid: true,
    }
  );
};
