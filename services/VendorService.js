const { Vendor } = require("../models/Vendor");
const bcrypt = require("bcrypt");
/*


const vendorInitialStore = {
  primaryContactName: "",
  primaryContactJobTitle: "",
  primaryContactPhone: "",

  secondaryContactName: "",
  secondaryContactJobTitle: "",
  secondaryContactPhone: "",

  vendorName: "",
  vendorEmail: "",

  EORI: "",
  EUVAT: "",
  FDANumber: "",
  FEINumber: "",
  password: "",
  confirmPassword: "",
  detailedAddress: "",
};
*/
const tabName = {
  organization: "VendorOrganization",
  address: "VendorAddress",
  licenses: "VendorLicenses",
  credentials: "VendorCredentials",
};
const INVALID_PRIMARY_CONTACT_NAME =
  "Primary person name must be 3 to 50 symbols";
const INVALID_PRIMARY_CONTACT_JOB_TITLE =
  "Primary Person'job title must be 3 to 50 symbols.";
const INVALID_PHONE_NUMBER =
  "Phone number is required (+359) or other country code.";
const PHONE_REGEX = /^\+[0-9]{3}\s[0-9]{6,9}$/;

const INVALID_SECONDARY_CONTACT_NAME =
  "Secondary person name must be 3 to 50 symbols";

const INVALID_SECONDARY_CONTACT_JOB_TITLE =
  "Secondary Person'job title must be 3 to 50 symbols.";

const INVALID_COMPANY_NAME = "Company name can be between 3 and 100 symbols.";

const INVALID_EMAIL = "Email address is required in correct format.";
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const validateOrganizationFields = (vendor) => {
  const { primaryPerson, secondaryPerson, companyName, email } = vendor;

  const primaryContactName = primaryPerson.name;
  const primaryContactJobTitle = primaryPerson.jobTitle;
  const primaryContactPhone = primaryPerson.phone;

  const secondaryContactName = secondaryPerson.name;
  const secondaryContactJobTitle = secondaryPerson.jobTitle;
  const secondaryContactPhone = secondaryPerson.phone;

  const Errors = {};
  if (
    !primaryContactName ||
    primaryContactName.length < 3 ||
    primaryContactName.length > 50
  ) {
    Errors.primaryContactName = INVALID_PRIMARY_CONTACT_NAME;
  }
  if (
    !primaryContactJobTitle ||
    primaryContactJobTitle.length < 3 ||
    primaryContactJobTitle.length > 50
  ) {
    Errors.primaryContactJobTitle = INVALID_PRIMARY_CONTACT_JOB_TITLE;
  }
  if (!primaryContactPhone || !PHONE_REGEX.test(primaryContactPhone)) {
    Errors.primaryContactPhone = INVALID_PHONE_NUMBER;
  }
  /************************************ */
  if (
    !secondaryContactName ||
    secondaryContactName.length < 3 ||
    secondaryContactName.length > 50
  ) {
    Errors.secondaryContactName = INVALID_SECONDARY_CONTACT_NAME;
  }
  if (
    !secondaryContactJobTitle ||
    secondaryContactJobTitle.length < 3 ||
    secondaryContactJobTitle.length > 50
  ) {
    Errors.secondaryContactJobTitle = INVALID_SECONDARY_CONTACT_JOB_TITLE;
  }
  if (!secondaryContactPhone || !PHONE_REGEX.test(secondaryContactPhone)) {
    Errors.secondaryContactPhone = INVALID_PHONE_NUMBER;
  }
  if (!companyName || companyName.length < 3 || companyName.length > 100) {
    Errors.companyName = INVALID_COMPANY_NAME;
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    Errors.email = INVALID_EMAIL;
  }
  return Errors;
};

const REQUIRED_MANUFACTORING_LICENSE =
  "Manufactoring License is required for vendors!";
const REQUIRED_IMPORT_EXPORT_LICENSE =
  "Import/Export license is required for all vendors to ship their orders.";
const RESIDENCE = "Valid residence is required.";
const ResidenceType = {
  EU: 1,
  NON_EU: 2,
};
const EORI_REGEX = /^[A-Z]{2}[A-Z0-9]{8,15}$/;
const INVALID_EORI =
  "EORI required: [country code] and 8 to 15 alphanumeric symbols";
const EUVAT_REGEX = /^[A-Z]{2}[A-Z0-9]{2,12}$/;
const INVALID_EUVAT =
  "EUVAT required: [country code] and 2 to 12 alphanumeric symbols";
const FDANumber_REGEX = /^\d{7,10}$/;
const INVALID_FDA_NUMBER = "FDA number consists of 7 to 10 digits";
const FEII_REGEX = /^\d{11}$/;
const INVALID_FEII_NUMBER = "FEI number consists of 11 digits";
const validateLicenses = (vendor) => {
  const Errors = {};
  const {
    manufactoringLicense,
    importExportLicense,
    residence,
    EORI,
    EUVAT,
    FDANumber,
    FEINumber,
  } = vendor;
  if (!manufactoringLicense) {
    Errors.manufacturingLicense = REQUIRED_MANUFACTORING_LICENSE;
  }
  if (!importExportLicense) {
    Errors.importExportLicense = REQUIRED_IMPORT_EXPORT_LICENSE;
  }
  if (
    !residence ||
    !Object.values(ResidenceType).some((type) => type === residence)
  ) {
    Errors.residence = RESIDENCE;
  }
  if (residence === ResidenceType.EU) {
    if (!EORI || !EORI_REGEX.test(EORI)) {
      console.log(EORI);

      Errors.EORI = INVALID_EORI;
    }
    if (!EUVAT || !EUVAT_REGEX.test(EUVAT)) {
      Errors.EUVAT = INVALID_EUVAT;
    }
  }
  if (residence === ResidenceType.NON_EU) {
    if (!FDANumber || !FDANumber_REGEX.test(FDANumber)) {
      Errors.FDANumber = INVALID_FDA_NUMBER;
    }
    if (!FEINumber || !FEII_REGEX.test(FEINumber)) {
      Errors.FEINumber = INVALID_FEII_NUMBER;
    }
  }
  return Errors;
};

const EMPTY_DETAILED_ADDRESS = "Invalid address location";
const validateAddress = (vendor) => {
  const Errors = {};

  if (
    !vendor.country ||
    !vendor.city ||
    !vendor.postcode ||
    !vendor.detailedAddress
  ) {
    Errors["detailedAddress"] = EMPTY_DETAILED_ADDRESS;
  }

  return Errors;
};
const PASSWORD_REGEX =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
const INVALID_PASSWORD = "Password have letters, digits and a special symbol!";
const PASSWORD_DONT_MATCH = "Password do NOT match";

const validatePassword = (vendor) => {
  const { confirmPassword, password } = vendor;
  const Errors = {};
  if (!password || !PASSWORD_REGEX.test(password)) {
    Errors.password = INVALID_PASSWORD;
  }
  if (password && PASSWORD_REGEX.test(password)) {
    if (confirmPassword !== password) {
      Errors.confirmPassword = PASSWORD_DONT_MATCH;
    }
  }
  return Errors;
};
const findIfVendorWithSuchEmailExists = async (vendor) => {
  const existing = await Vendor.findOne({ email: vendor.email });
  return existing;
};
const findIfVendorWithCompanyNameExists = async (vendor) => {
  const existing = await Vendor.findOne({ companyName: vendor.companyName });
  return existing;
};
const findIfVendorWithSuchEORIExists = async (vendor) => {
  const existing = await Vendor.findOne({ EORI: vendor.EORI });
  return existing;
};
const findIfVendorWithSuchEUVATExists = async (vendor) => {
  const existing = await Vendor.findOne({ EUVAT: vendor.EUVAT });
  return existing;
};
const findIfVendorWithSuchFDAExists = async (vendor) => {
  const existing = await Vendor.findOne({ FDANumber: vendor.FDANumber });
  return existing;
};
const findIfVendorWithSuchFEIIExists = async (vendor) => {
  const existing = await Vendor.findOne({ FEIINumber: vendor.FEIINumber });
  return existing;
};
const findIfSuchVendorExists = (vendor) => {
  const Existing = {};
  if (findIfVendorWithCompanyNameExists(vendor)) {
    Existing.companyName = true;
  }
  if (findIfVendorWithSuchEmailExists(vendor)) {
    Existing.email = true;
  }
  if (vendor.residence === ResidenceType.EU) {
    if (findIfVendorWithSuchEORIExists(vendor)) {
      Existing.EORI = true;
    }
    if (findIfVendorWithSuchEUVATExists(vendor)) {
      Existing.EUVAT = true;
    }
  }
  if (vendor.residence === ResidenceType.NON_EU) {
    if (findIfVendorWithSuchFDAExists(vendor)) {
      Existing.FDANumber = true;
    }
    if (findIfVendorWithSuchFEIIExists(vendor)) {
      Existing.FEIINumber = true;
    }
  }
  return Existing;
};
const saveVendor = async (req, res) => {
  const vendor = JSON.parse(req.body.vendor);
  const {
    manufactoringLicense,
    importExportLicense,
    specialAccessScheme,
    clinicalTrialParticipation,
    specialAuthorizationForControlledSubstances,
  } = req;
  console.log(vendor);
  const newVendor = new Vendor({
    primaryPerson: {
      name: vendor.primaryPerson.name,
      jobTitle: vendor.primaryPerson.jobTitle,
      phone: vendor.primaryPerson.phone,
    },
    secondaryPerson: {
      name: vendor.secondaryPerson.name,
      jobTitle: vendor.secondaryPerson.jobTitle,
      phone: vendor.secondaryPerson.phone,
    },
    companyName: vendor.companyName,
    email: vendor.email,
    manufactoringLicense: manufactoringLicense,
    importExportLicense: importExportLicense,
    specialAccessScheme: specialAccessScheme || "",
    clinicalTrialParticipation: clinicalTrialParticipation || "",
    specialAuthorizationForControlledSubstances:
      specialAuthorizationForControlledSubstances || "",
    residence: vendor.residence,
    EORI: vendor.EORI,
    EUVAT: vendor.EUVAT,
    FDANumber: vendor.FDANumber,
    FEINumber: vendor.FEINumber,
    password: await bcrypt.hash(vendor.password, 11),
    detailedAddress: vendor.detailedAddress,
    country: vendor.country,
    city: vendor.city,
    postcode: vendor.postcode,
  });
  const created = await newVendor.save();
  return created;
};
module.exports = {
  validateOrganizationFields,
  validateLicenses,
  validateAddress,
  validatePassword,
  findIfSuchVendorExists,
  saveVendor,
  tabName,
};
