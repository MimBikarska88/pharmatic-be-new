const { Schema, model, Types } = require("mongoose");
const { MedicationClass } = require("../models/MedicationClass");
const { Vendor } = require("../models/Vendor");

const CurrencyEnum = {
  Euro: 1,
  Dollar: 2,
};
Object.freeze(CurrencyEnum);
const PharmaceuticalProductSchema = new Schema({
  medicationName: {
    type: String,
    required: true,
    default: null,
  },
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
  price: {
    type: Number,
    default: 0,
    require: true,
  },
  currency: {
    type: Number,
    enum: Object.values(CurrencyEnum), // Restrict to values in StatusEnum
    required: true,
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
    required: true,
  },
  classification: {
    type: Types.ObjectId,
    ref: "MedicationClass",
    required: true,
  },
});
// Check if it works without it
PharmaceuticalProductSchema.index({
  medicationName: "text",
  isoCertificate: "text",
  chemicalFormula: "text",
  appearance: "text",
  routeOfAdministration: "text",
  indications: "text",
  sideEffect: "text",
});

const PharmaceuticalProduct = model(
  "PharmaceuticalProduct",
  PharmaceuticalProductSchema
);

module.exports = { PharmaceuticalProduct, CurrencyEnum };
