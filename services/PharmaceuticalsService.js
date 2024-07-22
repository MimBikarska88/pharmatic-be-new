const {
  PharmaceuticalProduct,
  CurrencyEnum,
} = require("../models/PharmaceuticalProduct");
const { ResidenceType } = require("../services/VendorService");
const { licenseTypes, labels } = require("../services/VendorService");
const mongoose = require("mongoose");
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
const validatePharmaceuticalProductFields = (product, isCreate = true) => {
  console.log("is create", isCreate);
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
  if (!classification) {
    Errors["classification"] = MISSING_CLASSIFICATION;
  }
  if (!licenseType) {
    Errors["licenseType"] = MISSING_LICENSE;
  }
  if (!pil && isCreate) {
    Errors["pil"] = MISSING_PIL;
  }
  if (!photo && isCreate) {
    Errors["photo"] = MISSING_IMAGE;
  }
  return Errors;
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
    licenseType: product.licenseType,
    publishedOn: Date.now(),
    modifiedOn: Date.now(),
    photo: product.photo,
    pil: product.pil,
    classification: product.classification,
    price: product.price,
    vendor: vendorId,
  });
  if (residence && Number(residence) === ResidenceType.EU) {
    newProduct.currency = CurrencyEnum.Euro;
  }
  if (residence && Number(residence) === ResidenceType.NON_EU) {
    newProduct.currency = CurrencyEnum.Dollar;
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
const findProductById = async (productId) => {
  const product = await PharmaceuticalProduct.findById(productId)
    .populate("classification")
    .lean();
  return product;
};
const updateProduct = async (vendorId, product) => {
  try {
    if (!product) {
      throw Error("Not found");
    }
    const { pil, photo, _id } = product;
    const exists = await PharmaceuticalProduct.findById(_id);
    if (!exists) {
      throw Error("Not found");
    }
    if (exists.vendor.toString() !== vendorId) {
      throw Error("Not authorized");
    }
    const data = {
      isoCertificate: product.isoCertificate,
      medicationName: product.medicationName,
      appearance: product.appearance,
      routeOfAdministration: product.routeOfAdministration,
      indications: product.indications,
      sideEffect: product.sideEffects,
      chemicalFormula: product.chemicalFormula,
      licenseType: product.licenseType,
      modifiedOn: Date.now(),
      classification: product.classification.value,
      licenseType: product.licenseType.value,
      price: product.price,
    };
    if (pil && pil.trim() !== "") {
      data["pil"] = pil;
    }
    if (photo && photo.trim() !== "") {
      data["photo"] = photo;
    }
    const updated = await PharmaceuticalProduct.findByIdAndUpdate(
      _id,
      { ...data },
      { new: true, runValidators: true }
    );
    return updated;
  } catch (err) {
    console.log(err.message);
    throw Error("Error updating product.");
  }
};

const search = async (classification, vendor, searchText) => {
  const pipeline = [];
  if (classification) {
    pipeline.push({
      $lookup: {
        from: "medicationclasses",
        localField: "classification",
        foreignField: "_id",
        as: "classificationDetails",
      },
    });
    pipeline.push({ $unwind: { path: "$classificationDetails" } });
  }
  if (vendor) {
    pipeline.push({
      $lookup: {
        from: "vendors",
        localField: "vendor",
        foreignField: "_id",
        as: "vendorDetails",
      },
    });
    pipeline.push({ $unwind: { path: "$vendorDetails" } });
  }

  const conditions = [];
  if (classification && mongoose.Types.ObjectId.isValid(classification)) {
    conditions.push({
      classification: new mongoose.Types.ObjectId(classification),
    });
  }
  if (vendor) {
    conditions.push({
      "vendorDetails.companyName": { $regex: vendor },
    });
  }
  if (searchText) {
    const partialStringRegex = new RegExp(`.*${searchText}.*`, "i");
    conditions.push({
      $or: [
        { medicationName: partialStringRegex },
        { chemicalFormula: partialStringRegex },
        { appearance: partialStringRegex },
        { routeOfAdministration: partialStringRegex },
        { indications: partialStringRegex },
        { sideEffect: partialStringRegex },
      ],
    });
  }
  if (conditions.length > 0) {
    pipeline.push({ $match: { $and: conditions } });
  }
  pipeline.push({
    $project: {
      medicationName: 1,
      isoCertificate: 1,
      chemicalFormula: 1,
      photo: 1,
      appearance: 1,
      routeOfAdministration: 1,
      indications: 1,
      sideEffect: 1,
      price: 1,
      currency: 1,
      publishedOn: 1,
      modifiedOn: 1,
      pil: 1,
      vendor: 1,
      licenseType: 1,
      classification: 1,
    },
  });
  const results = await PharmaceuticalProduct.aggregate(pipeline).exec();
  return results;
};
module.exports = {
  validatePharmaceuticalProductFields,
  findPharmaceuticalsByVendorId,
  saveProduct,
  findPharmaceuticalsByVendorId,
  findProductById,
  updateProduct,
  search,
};
