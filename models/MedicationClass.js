const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MedicationClassSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    enum: [
      "Central Nervous System Agents",
      "Cardiovascular Agents",
      "Cardiovascular Agents",
      "Alimentary Tract and Metabolism Agents",
      "Blood and Blood Forming Organs Agents",
      "Genitourinary Agents",
      "Antineoplastic and Immunomodulating Agents",
      "Antiinfective Agents",
      "Musculoskeletal Agents",
    ],
    required: true,
  },
});

const MedicationClass = mongoose.model(
  "MedicationClass",
  MedicationClassSchema
);

module.exports = MedicationClass;
