const { Op } = require("sequelize");
const { Products, Categories, Proveedores, Brands, Series } = require("../db");
const {
  uploadProductImage,
  updateProductImage,
} = require("../middlewares/cloudinary.js");
const fs = require("fs-extra");

async function getProducts(req, res) {
  const name = req.query.name;
  let reqProd = [];
  try {
    if (name) {
      try {
        let nameP = await Products.findAll({
          where: { status: 1 },
          include: [
            {
              model: Categories,
              attributes: ["name"],
            },
            {
              model: Proveedores,
              attributes: ["provider"],
            },
            {
              model: Brands,
              attributes: ["brand"],
            },
            {
              model: Series,
              attributes: ["serie"],
            },
          ],
        });
        for (let i of nameP) {
          if (i.name.includes(name)) {
            reqProd.push(i);
          }
        }
        if (reqProd.length) {
          return res.status(200).json(reqProd);
        } else {
          return res.status(400).json({ message: "unmatched product name" });
        }
      } catch (error) {
        return res
          .status(400)
          .json({ message: "error searching product by name", error });
      }
    } else {
      try {
        let aux2 = await Products.findAll({
          where: { status: 1 },
          include: [
            {
              model: Categories,
              attributes: ["name"],
            },
            {
              model: Proveedores,
              attributes: ["provider"],
            },
            {
              model: Brands,
              attributes: ["brand"],
            },
            {
              model: Series,
              attributes: ["serie"],
            },
          ],
        });

        return res.status(200).json(aux2);
      } catch (error) {
        return res
          .status(400)
          .json({ meesage: "error searching all products", error });
      }
    }
  } catch (error) {
    return res.status(400).send("error controller getProduct");
  }
}

async function statusCero(req, res) {
  try {
    const allProducts = await Products.findAll({
      where: { status: 0 },
      include: [
        {
          model: Categories,
          attributes: ["name"],
        },
        {
          model: Proveedores,
          attributes: ["provider"],
        },
        {
          model: Brands,
          attributes: ["brand"],
        },
        {
          model: Series,
          attributes: ["serie"],
        },
      ],
    });
    res.status(200).json(allProducts);
  } catch (error) {
    res.status(400).json({ message: error });
  }
}

async function productsId(req, res) {
  const { id } = req.params;

  try {
    let aux3 = await Products.findByPk(id, {
      include: [
        {
          model: Categories,
          attributes: ["name"],
        },
        {
          model: Proveedores,
          attributes: ["provider"],
        },
        {
          model: Brands,
          attributes: ["brand"],
        },
        {
          model: Series,
          attributes: ["serie"],
        },
      ],
    });
    return res.status(200).json(aux3);
  } catch (error) {
    return res.status(400).send("unmatch id");
  }
}

const postProducts = async (req, res) => {
  const {
    name,
    description,
    categories,
    discount,
    typeProduct,
    provider,
    price,
    rating,
    brand,
  } = req.body;
  console.log(req.body);
  if (req.files?.img) {
    try {
      const result = await uploadProductImage(req.files.img.tempFilePath);
      let newProduct = await Products.create({
        name,
        description,
        img: result.secure_url,
        imgId: result.public_id,
        discount,
        typeProduct,
        price,
        rating,
      });

      await fs.unlink(req.files.img.tempFilePath);

      let allCategories = await Categories.findAll({
        where: { name: categories },
      });
      const findBrand = await Brands.findOne({ where: { brand } });

      await newProduct.addCategories(allCategories);
      await newProduct.setBrand(findBrand);
      let findProvider = await Proveedores.findOne({
        where: { provider },
      });

      await newProduct.setProveedore(findProvider);

      return res
        .status(200)
        .json({ message: "product added successfully", newProduct });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error });
    }
  } else {
    try {
      let newProduct = await Products.create({
        name,
        description,
        discount,
        typeProduct,
        price,
        rating,
      });

      let allCategories = await Categories.findAll({
        where: { name: categories },
      });

      const findBrand = await Brands.findOne({ where: { brand } });

      await newProduct.addCategories(allCategories);
      await newProduct.setBrand(findBrand);
      let findProvider = await Proveedores.findOne({
        where: { provider },
      });

      await newProduct.setProveedore(findProvider);
      //FIXME: ERROR NO SETEA CATEGORIES

      console.log({
        categories: allCategories,
        brands: findBrand,
        Proveedor: findProvider,
      });

      //FIXME: ERROR NO SETEA CATEGORIES
      return res
        .status(200)
        .json({ message: "product added successfully", newProduct });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error });
    }
  }
};

async function deleteProducts(req, res) {
  let { id } = req.params;

  try {
    let product = await Products.findOne({ where: { id: id } });
    const statusCero = await product.update({ status: 0 });
    res.status(200).json({ message: "Product deleted", statusCero });
  } catch (error) {
    res.status(400).json({ message: error });
  }
}

async function restoreProducts(req, res) {
  let { id } = req.params;

  try {
    let product = await Products.findByPk(id);
    const statusUno = await product.update({ status: 1 });
    return res.status(200).json({ message: "Restore Product", statusUno });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

async function updateProducts(req, res) {
  let { id } = req.params;
  let { name, description, discount, typeProduct, price, rating } = req.body;

  if (req.files?.img) {
    try {
      let findProduct = await Products.findByPk(id);

      const imgUpdate = await updateProductImage(
        req.files.img.tempFilePath,
        findProduct.imgId
      );

      let update = await findProduct.update({
        name: name,
        img: imgUpdate.secure_url,
        imgId: imgUpdate.public_id,
        description: description,
        price: price,
        discount: discount,
        typeProduct: typeProduct,
        rating: rating,
      });

      await fs.unlink(req.files.img.tempFilePath);

      res.status(201).json({ message: "Product Updated", update });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  } else {
  }
}

async function pageCurrent(req, res) {
  let { id } = req.params; // capturamos el numero de pagina
  //TODO:PAGINAS
  console.log(id);
  if (id === "0") {
    try {
      const findProducts = await Products.findAll({
        where: { status: { [Op.eq]: 1 } },
      });
      console.log(findProducts);
      const pages = Math.ceil(findProducts.length / 10);
      return res.status(200).json({ status: "success", pages });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ status: "error", e });
    }
    //TODO:PAGINAS
  } else {
    let SelectedP = []; // declaramos el contenedor para las paginas filtradas
    itemsPage = parseInt(id); //  convertimos a numero el string id para poderlo usar en operaciones de suma

    let EndCursor = itemsPage * 10; // final del cursor de rango de seleccion de items de pagina  *10 items por pagina
    let StartCursor = EndCursor - 10; // inicio del cursor de rango de seleccion de iterms de pagina

    try {
      let Productos = await Products.findAll({
        where: { status: { [Op.eq]: 1 } },
        include: [
          {
            model: Categories,
            attributes: ["name"],
          },
          {
            model: Proveedores,
            attributes: ["provider"],
          },
          {
            model: Brands,
            attributes: ["brand"],
          },
          {
            model: Series,
            attributes: ["serie", "status"],
          },
        ],
      }); // bajamos los pruductos de Products a Productos con sequelize
      const ProductosArray = Productos; // convertimos Productos(objeto) en array para poder aplicar slice

      SelectedP = ProductosArray.slice(StartCursor, EndCursor); // generamos la rebanada deade un start(inicio) a un final(end)

      //console.log("Start ", StartCursor);    // para pruebas y control paginado
      //console.log("End ", EndCursor);         // par pruenas y control paginadp

      res.status(200).json(SelectedP); // enviamos la rebanada(slice) correspondiente
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
}

async function sortProducts(req, res) {
  let { id } = req.params; // se captura para el sort de ascendente a descendente entrada con "minusculas"
  let Productos;
  try {
    if (id == "a") {
      Productos = await Products.findAll({
        order: [["name", "ASC"]],
      });
    }

    if (id == "z") {
      Productos = await Products.findAll({
        order: [["name", "DESC"]],
      });
    }
    res.status(200).json(Productos);
  } catch (error) {
    res.status(400).json({ message: error });
  }
}
async function pageStatusCero(req, res) {
  let { id } = req.params; // capturamos el numero de pagina
  //TODO:PAGINAS
  console.log(id);
  if (id === "0") {
    try {
      const findSProducts = await Products.findAll({
        where: { status: { [Op.eq]: 0 } },
      });
      console.log(findSProducts);
      const pages = Math.ceil(findSProducts.length / 10);
      return res.status(200).json({ status: "success", pages });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ status: "error", e });
    }
    //TODO:PAGINAS
  } else {
    let SelectedP = []; // declaramos el contenedor para las paginas filtradas
    itemsPage = parseInt(id); //  convertimos a numero el string id para poderlo usar en operaciones de suma

    let EndCursor = itemsPage * 10; // final del cursor de rango de seleccion de items de pagina  *10 items por pagina
    let StartCursor = EndCursor - 10; // inicio del cursor de rango de seleccion de iterms de pagina

    try {
      let Productos = await Products.findAll({
        where: { status: { [Op.eq]: 0 } },
        include: [
          {
            model: Categories,
            attributes: ["name"],
          },
          {
            model: Proveedores,
            attributes: ["provider"],
          },
          {
            model: Brands,
            attributes: ["brand"],
          },
          {
            model: Series,
            attributes: ["serie"],
          },
        ],
      }); // bajamos los pruductos de Products a Productos con sequelize
      const ProductosArray = Productos; // convertimos Productos(objeto) en array para poder aplicar slice

      SelectedP = ProductosArray.slice(StartCursor, EndCursor); // generamos la rebanada deade un start(inicio) a un final(end)

      //console.log("Start ", StartCursor);    // para pruebas y control paginado
      //console.log("End ", EndCursor);         // par pruenas y control paginadp

      res.status(200).json(SelectedP); // enviamos la rebanada(slice) correspondiente
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
}

const popularProducts = async (req, res) => {
  try {
    const products = await Products.findAll({
      where: { rating: { [Op.gt]: 3 } },
    });
    console.log(products);
    return res.status(200).json(products);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

module.exports = {
  popularProducts,
  postProducts,
  getProducts,
  statusCero,
  productsId,
  updateProducts,
  deleteProducts,
  restoreProducts,
  pageCurrent,
  sortProducts,
  pageStatusCero,
};
