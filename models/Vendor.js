const { Schema, model } = require("mongoose");

const PersonSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const VendorSchema = new Schema(
  {
    primaryPerson: {
      type: PersonSchema,
      required: true,
    },
    secondaryPerson: {
      type: PersonSchema,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    manufactoringLicense: {
      type: String,
      default: null,
    },
    importExportLicense: {
      type: String,
      default: null,
    },
    specialAccessScheme: {
      type: String,
      default: null,
    },
    clinicalTrialParticipation: {
      type: String,
      default: null,
    },
    specialAuthorizationForControlledSubstances: {
      type: String,
      default: null,
    },
    residence: {
      type: String,
      required: true,
    },
    EORI: {
      type: String,
      default: null,
    },
    EUVAT: {
      type: String,
      default: null,
    },
    FDANumber: {
      type: String,
      default: null,
    },
    FEINumber: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    detailedAddress: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postcode: {
      type: String,
      required: true,
    },
    residence: {
      type: Number,
      required: true,
    },
  },
  {
    collation: {
      locale: "en",
      strength: 2,
    },
  }
);

const Vendor = model("Vendor", VendorSchema);
module.exports = { Vendor };
