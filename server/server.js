const express = require("express");
const cors = require("cors");
const { PharmaticRouter } = require("./router/PharmaticRouter");
const { configDatabase } = require("./config/mongoConfig");
const PORT = 8080;
const app = express();
const start = async () => {
  await configDatabase();
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use("/", PharmaticRouter);
  app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
  });
};
start();
