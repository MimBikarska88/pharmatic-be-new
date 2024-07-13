const MedicationClass = require("../models/MedicationClass");

const getMedicationClasses = async () => {
  const medicationClasses = await MedicationClass.find({}).lean();
  return medicationClasses;
};
const findClassificationById = async (id) => {
  const medicationClass = await MedicationClass.findById(id);
  return medicationClass;
};
module.exports = {
  getMedicationClasses,
  findClassificationById,
};
