const { Facturas, ProductsInCart, Users, conn } = require("../db");
const sequelize = conn;
const getDataProductsSold = async () => {
  try {
    const data = await sequelize.query(
      `SELECT country, public.products.name, SUM(public."productsInCarts".quantity) as quantitySold
        FROM public.facturas
        INNER JOIN public."productsInCarts" ON public.facturas.id = public."productsInCarts"."facturaId"
        INNER JOIN public.products ON public."productsInCarts"."productId" = public.products.id
        GROUP BY country, public.products.name`
    );
    const array = data[0].map((data) => {
      return { country: data.country, [data.name]: data.quantitysold };
    });
    let result = [];

    let map = new Map();

    for (let i = 0; i < array.length; i++) {
      let country = array[i].country;
      if (!map.has(country)) {
        map.set(country, { country: country });
      }
      Object.assign(map.get(country), array[i]);
    }

    for (let [key, value] of map) {
      result.push(value);
    }

    console.log(result);
    const keys = data[0].map((data, key) => {
      return data.name;
    });
    const filterKeys = Array.from(new Set(keys));
    return { keys: filterKeys, data: result };
  } catch (e) {
    console.log(e);
    return false;
  }
};
const getDataSold = async () => {
  try {
    const suma = await Facturas.sum("total");

    const promedio = suma / 2800.0;
    return { promedio, suma };
  } catch (e) {
    console.log(e);
    return false;
  }
};
const sumUsers = async () => {
  try {
    const suma = await Users.count({ where: { status: 1 } });
    return suma;
  } catch (e) {
    console.log(e);
    return false;
  }
};
module.exports = { getDataProductsSold, getDataSold, sumUsers };
