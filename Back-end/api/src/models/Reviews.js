const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("reviews", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        min: 0.0,
        max: 5.0,
      },
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
