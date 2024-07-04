const { Router } = require("express");
const { CustomerController } = require("../../controllers/CustomerController");
const { VendorController } = require("../../controllers/VendorController");

const { upload } = require("../config/multerConfig");

const PharmaticRouter = Router();
PharmaticRouter.post(
  "/customer/register",
  upload.single("latestMedicalCheckup"),
  CustomerController["register"]
);
PharmaticRouter.post(
  "/vendor/register",
  upload.fields([
    { name: "importExportLicense", maxCount: 1 },
    { name: "specialAccessScheme", maxCount: 1 },
    { name: "clinicalTrialParticipation", maxCount: 1 },
    { name: "specialAuthorizationForControlledSubstances", maxCount: 1 },
  ]),
  VendorController["register"]
);
PharmaticRouter.post("/logout", CustomerController["logout"]);
PharmaticRouter.post("/login", CustomerController["login"]);
module.exports = {
  PharmaticRouter,
};
