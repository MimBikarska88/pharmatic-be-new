const { Schema, model } = require("mongoose");

const MedicalRecordSchema = new Schema({
  medicalFacility: {
    type: String,
    required: true,
  },
  medicalInterventionType: {
    type: String,
    required: true,
  },
  arrivalDate: {
    type: Date,
    required: true,
  },
  leaveDate: {
    type: Date,
    required: true,
  },
});

const MedicationSchema = new Schema({
  medicationName: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
  },
  roa: {
    // Route of administration
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  indication: {
    type: String,
    required: true,
  },
  sideEffect: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
});

const CustomerSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
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
    medicalRecords: {
      type: [MedicalRecordSchema],
      default: [],
    },
    medications: {
      type: [MedicationSchema],
      default: [],
    },
    generalPractitioner: {
      type: String,
    },
    latestMedicalCheckup: {
      type: String, // Store the file path or URL as a string
    },
    allergicSymptoms: {
      type: String,
    },
    allergicTriggers: {
      type: String,
    },
  },
  {
    collation: {
      locale: "en",
      strength: 2,
    },
  }
);
const Customer = model("Customer", CustomerSchema);
module.exports = { Customer };
