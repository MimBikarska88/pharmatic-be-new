module.exports = {
  VendorController: {
    register: async (req, res) => {
      const vendor = JSON.parse(req.body.vendor);
      console.log(vendor);
      return res.status(200).json({ ...vendor });
    },
  },
};
