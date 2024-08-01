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
const getRandomNumber = (digits) => {
  const max = Math.pow(10, digits) - 1;
  const min = Math.pow(10, digits - 1);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
module.exports = {
  deleteFile,
  getRandomNumber,
};
