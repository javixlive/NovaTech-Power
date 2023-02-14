const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("carts", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    totalPrice: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.0,
      validate: {
        min: 0.0,
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,

      defaultValue: "pending",
    },
  });
};
