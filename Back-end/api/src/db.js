require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  {
    logging: false,
    native: false,
  }
);
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const {
  Carts,
  Categories,
  Facturas,
  Products,
  ProductsInCart,
  Reviews,
  Roles,
  Users,
  Proveedores,
  Orders,
  Notifications,
  Cupones,
  Series,
  Brands,
  Messages,
} = sequelize.models;

//TODO:RELACIONES

Roles.hasMany(Users, { foreignKey: "rolId" });
Users.belongsTo(Roles, { foreignKey: "rolId" });

Carts.hasMany(Users, { foreignKey: "cartId" });
Users.belongsTo(Carts, { foreignKey: "cartId" });

Carts.hasMany(ProductsInCart, { foreignKey: "cartId" });
ProductsInCart.belongsTo(Carts, { foreignKey: "cartId" });

Products.hasMany(ProductsInCart, { foreignKey: "productId" });
ProductsInCart.belongsTo(Products, { foreignKey: "productId" });

Users.hasMany(Facturas, { foreignKey: "userId" });
Facturas.belongsTo(Users, { foreignKey: "userId" });

Facturas.hasMany(ProductsInCart, { foreignKey: "facturaId" });
ProductsInCart.belongsTo(Facturas, { foreignKey: "facturaId" });

Products.belongsToMany(Categories, { through: "categoriesInProducts" });
Categories.belongsToMany(Products, { through: "categoriesInProducts" });

Products.hasMany(Reviews, { foreignKey: "productId" });
Reviews.belongsTo(Products, { foreignKey: "productId" });

Users.hasMany(Reviews, { foreignKey: "userId" });
Reviews.belongsTo(Users, { foreignKey: "userId" });

//TODO: CADA VENDEDOR Y ADMINISTRADOS PPUEDE AGREGAR UN PRODUCTO
Users.belongsToMany(Products, { through: "usersProducts" });
Products.belongsToMany(Users, { through: "usersProducts" });

Users.hasMany(Notifications, { foreignKey: "userId" });
Notifications.belongsTo(Users, { foreignKey: "userId" });

Users.hasMany(Cupones, { foreignKey: "userId" });
Cupones.belongsTo(Users, { foreignKey: "userId" });

Proveedores.hasMany(Products, { foreignKey: "proveedorId" });
Products.belongsTo(Proveedores, { foreignKey: "proveedorId" });

Facturas.hasMany(Orders, { foreignKey: "facturaId" });
Orders.belongsTo(Facturas, { foreignKey: "facturaId" });

Products.hasMany(Series, { foreignKey: "productId" });
Series.belongsTo(Products, { foreignKey: "productId" });

Brands.hasMany(Products, { foreignKey: "brandId" });
Products.belongsTo(Brands, { foreignKey: "brandId" });

Users.hasMany(Messages, { foreignKey: "userId" });
Messages.belongsTo(Users, { foreignKey: "userId" });
//TODO:RELACIONES

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,
  // para importart la conexión { conn } = require('./db.js');
};
