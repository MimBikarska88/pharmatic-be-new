const { Router } = require("express");
const { CustomerController } = require("../../controllers/CustomerController");
const { VendorController } = require("../../controllers/VendorController");
const {
  PharmaceuticalsController,
} = require("../../controllers/PharmaceuticalsController");

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
    { name: "manufactoringLicense", maxCount: 1 },
    { name: "importExportLicense", maxCount: 1 },
    { name: "specialAccessScheme", maxCount: 1 },
    { name: "clinicalTrialParticipation", maxCount: 1 },
    { name: "specialAuthorizationForControlledSubstances", maxCount: 1 },
  ]),
  VendorController["register"]
);
PharmaticRouter.post("/customer/logout", CustomerController["logout"]);
PharmaticRouter.post("/customer/login", CustomerController["login"]);
PharmaticRouter.post("/vendor/logout", VendorController["logout"]);
PharmaticRouter.post("/vendor/login", VendorController["login"]);
PharmaticRouter.get("/vendor/licenses", VendorController["getLicenses"]);
PharmaticRouter.get(
  "/vendor/products",
  PharmaceuticalsController["getAllProductsByVendorId"]
);
PharmaticRouter.get(
  "/vendor/products/:productId",
  PharmaceuticalsController["getProductById"]
);
PharmaticRouter.get(
  "/pharmaceutical/classifications",
  PharmaceuticalsController["getClassifications"]
);
PharmaticRouter.post(
  "/products",
  upload.fields([
    { name: "pil", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  PharmaceuticalsController["createPharmaceuticalProduct"]
);
PharmaticRouter.put(
  "/products/:productId",
  upload.fields([
    { name: "pil", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  PharmaceuticalsController["updateProduct"]
);
module.exports = {
  PharmaticRouter,
};
