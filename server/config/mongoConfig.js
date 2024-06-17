const mongoose = require("mongoose");
const connectionString = "mongodb://localhost:27017/pharmatic";

async function configDatabase() {
  await mongoose.connect(connectionString);
  console.log("database connected");
}
module.exports = {
  configDatabase,
};
