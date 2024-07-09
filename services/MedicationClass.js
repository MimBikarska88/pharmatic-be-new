const MedicationClass = require("../models/MedicationClass");

const getMedicationClasses = async () => {
  const medicationClasses = await MedicationClass.find({}).lean();
  return medicationClasses;
};
module.exports = {
  getMedicationClasses,
};
