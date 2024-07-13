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
  photo: {
    type: String,
    default: null,
    required: true,
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
  priceEu: {
    type: Number,
    default: 0,
    require: true,
  },
  priceNonEu: {
    type: Number,
    default: 0,
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
  licenseType: {
    type: Number,
  },
  classification: {
    type: Types.ObjectId,
    ref: "MedicationClass",
    required: true,
  },
});

const PharmaceuticalProduct = model(
  "PharmaceuticalProduct",
  PharmaceuticalProductSchema
);

module.exports = { PharmaceuticalProduct };
