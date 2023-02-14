const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("orders", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    purchaseId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "CREATE",
    },
    invoiceNumber: DataTypes.STRING,
  });
};
