const { Customer } = require("../models/Customer");
const {
  validateContactFields,
  validateAddressFields,
  checkIfEmailExists,
  create,
} = require("../services/CustomerService");
const { createToken } = require("../services/jwtService");

const CustomerController = {
  register: async (req, res) => {
    const contactsErrors = validateContactFields(req.body);
    if (Object.keys(contactsErrors).length > 0) {
      return res.status(400).json({ tabIndex: 0, errors: contactsErrors });
    }
    const addressErrors = validateAddressFields(req.body);
    if (Object.keys(addressErrors).length > 0) {
      return res.status(400).json({ tabIndex: 1, errors: addressErrors });
    }
    if (await checkIfEmailExists(req.body?.email)) {
      return res
        .status(400)
        .json({ message: "Customer with this email exists already!" });
    }
    try {
      const user = await create(req.body);
      const token = await createToken(user);
      return res.status(200).json({ token: token });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};
module.exports = { CustomerController };
