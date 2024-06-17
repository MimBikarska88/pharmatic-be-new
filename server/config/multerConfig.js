const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/pharmatic/records");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

// used for user uploading their check-up
const uploadLatestMedicalCheckup = upload.fields([
  { name: "latestMedicalCheckup", maxCount: 1 },
]);
module.exports = {
  uploadLatestMedicalCheckup,
};
