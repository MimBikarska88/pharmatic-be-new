const { getMedicationClasses } = require("../services/MedicationClass");
module.exports = {
  PharmaceuticalsController: {
    getClassifications: async (req, res) => {
      const classifications = await getMedicationClasses();
      res.status(200).json(classifications);
    },
    createPharmaceuticalProduct: async (req, res) => {
      const vendorId = req.user.id;
      const product = req.body;
      console.log(product);
      res.status(200).json(product);
    },
  },
};
