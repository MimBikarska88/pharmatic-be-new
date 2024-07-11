const { Router } = require("express");
const { CustomerController } = require("../../controllers/CustomerController");
const { VendorController } = require("../../controllers/VendorController");
const {
  PharmaceuticalsController,
} = require("../../controllers/PharmaceuticalsController");

const { upload } = require("../config/multerConfig");
const { getVendorAvailableLicenses } = require("../../services/VendorService");

const PharmaticRouter = Router();
PharmaticRouter.post(
  "/customer/register",
  upload.single("latestMedicalCheckup"),
  CustomerController["register"]
);
PharmaticRouter.post(
  "/vendor/register",
  upload.fields([
    { name: "manufactoringLicense", maxCount: 1 },
    { name: "importExportLicense", maxCount: 1 },
    { name: "specialAccessScheme", maxCount: 1 },
    { name: "clinicalTrialParticipation", maxCount: 1 },
    { name: "specialAuthorizationForControlledSubstances", maxCount: 1 },
  ]),
  VendorController["register"]
);
PharmaticRouter.post("/logout", CustomerController["logout"]);
PharmaticRouter.post("/login", CustomerController["login"]);
PharmaticRouter.post("/vendor/login", VendorController["login"]);
PharmaticRouter.get("/vendor/licenses", VendorController["getLicenses"]);
PharmaticRouter.get(
  "/pharmaceutical/classifications",
  PharmaceuticalsController["getClassifications"]
);
PharmaticRouter.post(
  "/products",
  PharmaceuticalsController["createPharmaceuticalProduct"]
);

module.exports = {
  PharmaticRouter,
};
