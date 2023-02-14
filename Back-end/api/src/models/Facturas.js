const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "facturas",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      numberBill: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      paymentId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamp: true,
      paranoid: true,
    }
  );
};
