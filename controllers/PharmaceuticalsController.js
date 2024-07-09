const { getMedicationClasses } = require("../services/MedicationClass");
module.exports = {
  PharmaceuticalsController: {
    getClassifications: async (req, res) => {
      const classifications = await getMedicationClasses();
      res.status(200).json({ classifications });
    },
  },
};
