const { Router } = require("express");
const { CustomerController } = require("../../controllers/CustomerController");
const { uploadLatestMedicalCheckup } = require("../config/multerConfig");
const PharmaticRouter = Router();
PharmaticRouter.get("/customer", (req, res) => {
  res.json("hello");
});
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
module.exports = {
  PharmaticRouter,
};
