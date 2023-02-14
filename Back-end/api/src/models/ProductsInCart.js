const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("productsInCart", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  });
};
