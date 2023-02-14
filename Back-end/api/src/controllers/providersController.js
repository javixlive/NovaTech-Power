const { Proveedores } = require("../db");

const getAllProviders = async (req, res) => {
  const { name } = req.query;
  try {
    if (!name) {
      try {
        let providersDb = await Proveedores.findAll();
        providersDb.length
          ? res.status(200).json({ Status: "Success", Providers: providersDb })
          : res.status(404).json({
              Status: "Alert",
              Message: "There are no providers to display",
            });
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      let provider = await Proveedores.findOne({
        where: {
          name,
        },
      });
      provider
        ? res.status(200).json({ Status: "Success", Provider: provider })
        : res.json({ Status: "Alert", msg: "Provider not found" });
    }
  } catch (error) {
    return res.status(500).send("ERROR: ", error);
  }
};

const createProvider = async (req, res) => {
  try {
    const { provider, phone, email } = req.body;
    const newProvider = await Proveedores.create({ provider, phone, email });
    res
      .status(201)
      .json({ Message: "Provider created successfully", newProvider });
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { provider, phone, email } = req.body;
    const providerUpdate = await Proveedores.findByPk(id);
    providerUpdate.provider = provider;
    providerUpdate.phone = phone;
    providerUpdate.email = email;
    await providerUpdate.save();
    res
      .status(200)
      .json({ Message: "Provider updated successfully", providerUpdate });
  } catch (error) {
    res.status(500).json(error);
  }
};
const deleteProvider = async (req, res) => {
  try {
    const { id } = req.params;
    await Proveedores.destroy({
      where: {
        id,
      },
    });
    res.status(200).json({ Message: "Provider successfully removed" });
  } catch (error) {
    res.status(500).json(error);
  }
};
module.exports = {
  getAllProviders,
  createProvider,
  updateProvider,
  deleteProvider,
};
