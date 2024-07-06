const multer = require("multer");
const path = require("path");
const locationMedicalCheckUp = "uploads/customer/medicalCheckUps";
const locationVendorManufactoringLicense =
  "uploads/vendor/manufactoringLicense";
const locationVendorImportExportLicense = "uploads/vendor/importExportLicense";
const locationVendorSAS = "uploads/vendor/sas";
const locationClinicalTrialParticipation =
  "uploads/vendor/clinicalTrialParticipation";
const locationSpecialControlSubstances = "uploads/vendor/controlledSubstances";
const selectFileLocation = (filename) => {
  switch (filename) {
    case "latestMedicalCheckup":
      return locationMedicalCheckUp;
    case "manufactoringLicense":
      return locationVendorManufactoringLicense;
    case "importExportLicense":
      return locationVendorImportExportLicense;
    case "specialAccessScheme":
      return locationVendorSAS;
    case "clinicalTrialParticipation":
      return locationClinicalTrialParticipation;
    case "specialAuthorizationForControlledSubstances":
      return locationSpecialControlSubstances;
  }
  return "uploads";
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const location = selectFileLocation(file.fieldname);
    //req.location = location;
    cb(null, location);
  },
  filename: (req, file, cb) => {
    const newFileName = path.join(
      Date.now().toString() + path.extname(file.originalname)
    );
    req[`${file.fieldname}`] = newFileName;
    cb(null, newFileName);
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
