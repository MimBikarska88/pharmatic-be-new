const { Customer } = require("../models/Customer");
const {
  validateContactFields,
  validateAddressFields,
  checkIfEmailExists,
  create,
  logout,
  deleteMedicalCheckUpFileIfErrors,
} = require("../services/CustomerService");
const { createToken } = require("../services/jwtService");

const CustomerController = {
  register: async (req, res) => {
    const customer = JSON.parse(req.body.customer);
    const contactsErrors = validateContactFields(customer);
    if (Object.keys(contactsErrors).length > 0) {
      await deleteMedicalCheckUpFileIfErrors(req);
      return res.status(400).json({ tabIndex: 0, errors: contactsErrors });
    }
    const addressErrors = validateAddressFields(customer);
    if (Object.keys(addressErrors).length > 0) {
      await deleteMedicalCheckUpFileIfErrors(req);
      return res.status(400).json({ tabIndex: 1, errors: addressErrors });
    }
    if (await checkIfEmailExists(customer?.email)) {
      await deleteMedicalCheckUpFileIfErrors(req);
      return res
        .status(400)
        .json({ message: "Customer with this email exists already!" });
    }
    try {
      const user = await create(customer);
      if (user) {
        return res.status(200).json({ Message: "User created successfully!" });
      }
      throw Error("User registration was not successfull!");
    } catch (err) {
      console.log(err);
      await deleteMedicalCheckUpFileIfErrors(req);
      return res.status(500).json({ message: err.message });
    }
  },
  logout: (req, res) => {
    logout(req, res);
    return res.status(200).json("User logged out");
  },
  login: async (req, res) => {
    const { username, password } = req.body;
    try {
      if (!username || !password) {
        throw new Error("All fields are required");
      }
      const user = await UserService.login(username, password);

      if (user) {
        token = createToken(user);
        res.cookie("token", token, { httpOnly: true });
        res.status(200).json("User logged in!");
      }
    } catch (err) {
      return res.status(400).json("Invalid email or password");
    }
  },
};
module.exports = { CustomerController };
