const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("roles", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rol: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  });
};
