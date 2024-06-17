const { Router } = require("express");
const { CustomerController } = require("../../controllers/CustomerController");
const { uploadLatestMedicalCheckup } = require("../config/multerConfig");
const PharmaticRouter = Router();
PharmaticRouter.post(
  "/customer/register",
  uploadLatestMedicalCheckup,
  (req, res, next) => {
    if (req.files && req.files.latestMedicalCheckup) {
      req.filePath = req.files.latestMedicalCheckup[0].path;
    }
    next();
  },
  CustomerController["register"]
);
PharmaticRouter.post("/logout", CustomerController["logout"]);
PharmaticRouter.post("/login", CustomerController["login"]);
module.exports = {
  PharmaticRouter,
};
