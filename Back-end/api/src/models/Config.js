const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("config", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    iva: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 12.0,
    },
    ruc: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "999999",
    },
    razonSocial: {
      type: DataTypes.STRING,
      allowNUll: false,
    },
  });
};
