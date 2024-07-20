const fs = require("fs").promises;
const path = require("path");
const deleteFile = async (fileName, location) => {
  const filePath = path.join(location, fileName);
  try {
    await fs.unlink(filePath);
    console.log("File deleted successfully", filePath);
  } catch (err) {
    console.log(err.message);
    throw Error(`Error deleting file: ${filePath}`);
  }
};

module.exports = {
  deleteFile,
};
