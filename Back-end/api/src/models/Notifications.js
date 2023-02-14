const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("notifications", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    notify: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
