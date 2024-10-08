const {
  getMedicationClasses,
  findClassificationById,
} = require("../services/MedicationClass");
const {
  validatePharmaceuticalProductFields,
  saveProduct,
  findPharmaceuticalsByVendorId,
  findProductById,
  updateProduct,
  search,
} = require("../services/PharmaceuticalsService");
const { findVendorById } = require("../services/VendorService");
const { deleteFile } = require("../utils/utils");
const { selectFileLocation } = require("../server/config/multerConfig");
module.exports = {
  PharmaceuticalsController: {
    getClassifications: async (req, res) => {
      const classifications = await getMedicationClasses();
      return res.status(200).json(classifications);
    },
    createPharmaceuticalProduct: async (req, res) => {
      const vendorId = req?.user.id;
      if (!vendorId) {
        return res.status(401).json({ Message: "Not authorized" });
      }
      const vendor = await findVendorById(vendorId);
      if (!vendor) {
        return res.status(404).json({ Message: "Vendor doesn't exist" });
      }

      const product = { ...req.body, photo: req?.photo, pil: req?.pil };
      let Errors = validatePharmaceuticalProductFields(product, true);
      if (Object.keys(Errors).length > 0) {
        if (product.photo && product.photo.trim() !== "") {
          const photoLocation = selectFileLocation("photo");
          await deleteFile(product.photo, photoLocation);
        }
        if (product.pil && product.pil.trim() !== "") {
          const pilLocation = selectFileLocation("pil");
          await deleteFile(product.pil, pilLocation);
        }
        return res.status(400).json({ Errors: Errors });
      }
      const classification = await findClassificationById(
        product.classification
      );
      if (!classification) {
        return res
          .status(404)
          .json({ Message: "Classification is not existing" });
      }
      try {
        const productNew = await saveProduct(product, vendorId);
        return res.status(200).json(productNew);
      } catch (err) {
        console.log(err.message);
        return res.status(500).json({ Message: "Something went wrong" });
      }
    },
    getAllProductsByVendorId: async (req, res) => {
      const vendorId = req?.user?.id;
      if (!vendorId) {
        return res.status(401).json({ Message: "Not authorized" });
      }
      const products = await findPharmaceuticalsByVendorId(vendorId);
      return res.status(200).json({ products });
    },
    getProductById: async (req, res) => {
      const { productId } = req.params;
      if (!productId) {
        return res.status(400).json({ Message: "Product Id is missing" });
      }
      const product = await findProductById(productId);
      if (product) {
        return res.status(200).json({ ...product });
      }
      return res.status(404).message("Not found");
    },
    updateProduct: async (req, res) => {
      const vendorId = req?.user?.id;
      if (!vendorId) {
        return res.status(401).json({ Message: "Not authorized" });
      }
      const product = { ...req.body, photo: req?.photo, pil: req?.pil };
      let Errors = validatePharmaceuticalProductFields(product, false);
      if (Object.keys(Errors).length > 0) {
        // delete photo and pil
        return res.status(400).json({ Errors: Errors });
      }
      const classification = await findClassificationById(
        product.classification.value
      );
      if (!classification) {
        return res
          .status(404)
          .json({ Message: "Classification is not existing" });
      }
      try {
        const updatedProduct = await updateProduct(vendorId, product);
        return res.status(200).json({ ...updatedProduct });
      } catch (err) {
        return res.status(401).json({ Message: err.message });
      }
    },
    search: async (req, res) => {
      const { classification, vendor, searchText } = req.query;
      const result = await search(classification, vendor, searchText);
      return res.status(200).json(result);
    },
  },
};
