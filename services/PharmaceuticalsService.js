const { PharmaceuticalProduct } = require("../models/PharmaceuticalProduct");
const { ResidenceType } = require("../services/VendorService");
const path = require("path");
const ISO_REGEX = /^ISO\s?\d{4}(:\d{4})?$/;
const ISO_ERROR_MISSING = "ISO Certificate number required";
const WRONG_ISO_FORMAT = "ISO Certificate format is incorrect";
const MISSING_FORMULA = "Chemical Formula is required field.";
const FORMULA_REGEX = /^([A-Z][a-z]?\d*)+$/;
const WRONG_FORMULA_FORMAT = "Chemical Formula can have letters and digits.";
const MISSING_APPEARANCE = "Appearance is required field.";
const MISSING_MEDICATION_NAME = "Medication name is required field.";
const MISSING_ROA = "Route Of Administration is required field.";
const MISSING_INDICATIONS = "Indications for usage are required.";
const MISSING_SIDE_EFFECTS = "Side Effects information is required";
const MISSING_PRICE = "Price is required field.";
const MISSING_PIL = "Patient Information Leaflet is required";
const MISSING_IMAGE = "Product Image is required.";
const MISSING_CLASSIFICATION = "Classification is required.";
const MISSING_LICENSE = "License Type is required";
const validatePharmaceuticalProductFields = (product) => {
  const {
    isoCertificate,
    chemicalFormula,
    appearance,
    routeOfAdministration,
    indications,
    sideEffects,
    price,
    pil,
    classification,
    licenseType,
    medicationName,
    photo,
  } = product;
  const Errors = {};
  if (!isoCertificate || isoCertificate.trim() === "") {
    Errors[`isoCertificate`] = ISO_ERROR_MISSING;
  } else if (!ISO_REGEX.test(isoCertificate)) {
    Errors[`isoCertificate`] = WRONG_ISO_FORMAT;
  }
  if (!chemicalFormula || !chemicalFormula.trim() === "") {
    Errors["chemicalFormula"] = MISSING_FORMULA;
  } else if (!FORMULA_REGEX.test(chemicalFormula)) {
    Errors["chemicalFormula"] = WRONG_FORMULA_FORMAT;
  }
  if (!appearance || appearance.trim() === "") {
    Errors["appearance"] = MISSING_APPEARANCE;
  }
  if (!medicationName || medicationName.trim() === "") {
    Errors["medicationName"] = MISSING_MEDICATION_NAME;
  }
  if (!routeOfAdministration || routeOfAdministration.trim() === "") {
    Errors["roadOfAdministration"] = MISSING_ROA;
  }
  if (!indications || indications.trim() === "") {
    Errors["indications"] = MISSING_INDICATIONS;
  }
  if (!sideEffects || sideEffects.trim() === "") {
    Errors["sideEffects"] = MISSING_SIDE_EFFECTS;
  }
  if (!price) {
    Errors["price"] = MISSING_PRICE;
  }
  if (!pil) {
    Errors["pil"] = MISSING_PIL;
  }
  if (!classification) {
    Errors["classification"] = MISSING_CLASSIFICATION;
  }
  if (!licenseType) {
    Errors["licenseType"] = MISSING_LICENSE;
  }
  if (!pil) {
    Errors["pil"] = MISSING_PIL;
  }
  if (!photo) {
    Errors["pil"] = MISSING_IMAGE;
  }
  return Errors;
};

const exchangeRate = 0.95;
const convertEuroToDollars = (price) => {
  return price / exchangeRate;
};

const convertDollarsToEuro = (price) => {
  return price * exchangeRate;
};
const saveProduct = async (product, vendorId) => {
  const residence = product.residence;

  const newProduct = new PharmaceuticalProduct({
    isoCertificate: product.isoCertificate,
    medicationName: product.medicationName,
    appearance: product.appearance,
    routeOfAdministration: product.routeOfAdministration,
    indications: product.indications,
    sideEffect: product.sideEffects,
    chemicalFormula: product.chemicalFormula,
    publishedOn: Date.now(),
    modifiedOn: Date.now(),
    photo: product.photo,
    pil: product.pil,
    classification: product.classification,
    vendor: vendorId,
  });
  if (residence && Number(residence) === ResidenceType.EU) {
    newProduct.priceEu = product.price;
    newProduct.priceNonEu = convertEuroToDollars(product.price);
  }
  if (residence && Number(residence) === ResidenceType.EU) {
    newProduct.priceNonEu = product.price;
    newProduct.priceEu = convertDollarsToEuro(product.price);
  }
  const created = await newProduct.save();
  return created;
};
const findPharmaceuticalsByVendorId = async (vendorId) => {
  const products = await PharmaceuticalProduct.find({
    vendor: vendorId,
  }).lean();
  const filtered = products.filter((p) => p.photo && p.photo.trim() !== "");
  return filtered;
};
module.exports = {
  validatePharmaceuticalProductFields,
  findPharmaceuticalsByVendorId,
  saveProduct,
  findPharmaceuticalsByVendorId,
};
