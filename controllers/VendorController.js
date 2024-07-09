const {
  validateOrganizationFields,
  tabName,
  validateLicenses,
  validateAddress,
  validatePassword,
  findIfSuchVendorExists,
  saveVendor,
  login,
  getVendorAvailableLicenses,
} = require("../services/VendorService");
const { createToken } = require("../services/JwtService");
module.exports = {
  VendorController: {
    register: async (req, res) => {
      const vendor = JSON.parse(req.body.vendor);
      let Errors = validateOrganizationFields(vendor);
      if (Object.keys(Errors).length > 0) {
        return res.status(400).json({ Errors, tabName: tabName.organization });
      }
      Errors = validateLicenses(vendor);
      if (Object.keys(Errors).length > 0) {
        return res.status(400).json({ Errors, tabName: tabName.licenses });
      }
      Errors = validateAddress(vendor);
      if (Object.keys(Errors).length > 0) {
        return res.status(400).json({ Errors, tabName: tabName.address });
      }
      Errors = validatePassword(vendor);
      if (Object.keys(Errors).length > 0) {
        return res.status(400).json({ Errors, tabName: tabName.credentials });
      }
      const Existing = await findIfSuchVendorExists(vendor);
      console.log(Existing);
      if (Object.values(Existing).some((value) => value)) {
        return res.status(400).json({ Existing });
      }
      try {
        const created = await saveVendor(req);
        return res.status(200).json({ ...created });
      } catch (err) {
        console.log(err);
        return res
          .status(400)
          .json({ message: { ...err }, tabName: tabName.credentials });
      }
    },
    login: async (req, res) => {
      try {
        const found = await login(req);
        if (found) {
          token = createToken(found);
          res.cookie("token", token, { httpOnly: true });
          res.status(200).json("User logged in!");
        }
      } catch (err) {
        console.log(err.message);
        res.status(400).json({ message: err.message });
      }
    },
    getLicenses: async (req, res) => {
      try {
        const id = req.user.id;
        const licenses = await getVendorAvailableLicenses(id);
        console.log(licenses);
        res.status(200).json({ licenses });
      } catch (err) {
        console.log(err.message);
        res.status(400).json({ message: err.message });
      }
    },
  },
};
