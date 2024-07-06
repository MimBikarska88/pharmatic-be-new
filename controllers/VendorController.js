const {
  validateOrganizationFields,
  tabName,
  validateLicenses,
  validateAddress,
  validatePassword,
  findIfSuchVendorExists,
  saveVendor,
} = require("../services/VendorService");

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
      if (Object.keys(Existing).length > 0) {
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
  },
};
