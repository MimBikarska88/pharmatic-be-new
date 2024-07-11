const { Schema, model, Types } = require("mongoose");
const { MedicationClass } = require("../models/MedicationClass");
const { Vendor } = require("../models/Vendor");
const PharmaceuticalProductSchema = new Schema({
  isoCertificate: {
    type: String,
    default: "",
    require: true,
  },
  chemicalFormula: {
    type: String,
    default: "",
    require: true,
  },
  appearance: {
    type: String,
    default: "",
    require: true,
  },
  routeOfAdministration: {
    type: String,
    default: "",
    require: true,
  },
  indications: {
    type: String,
    default: "",
    require: true,
  },
  sideEffect: {
    type: String,
    default: "",
    require: true,
  },
  currencyNonEu: {
    type: String,
    default: "",
    require: true,
  },
  currencyEu: {
    type: String,
    default: "",
    require: true,
  },
  publishedOn: {
    type: Date,
    default: null,
  },
  modifiedOn: {
    type: Date,
    default: null,
  },
  pil: {
    type: String,
    default: "",
    require: true,
  },
  vendor: {
    type: Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  classification: {
    type: Types.ObjectId,
    ref: "MedicationClass",
    required: true,
  },
});

const PharmaceuticalProduct = mongoose.model(
  "PharmaceuticalProduct",
  PharmaceuticalProductSchema
);

module.exports = { PharmaceuticalProduct };
