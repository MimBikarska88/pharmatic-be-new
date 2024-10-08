const { PharmaticRouter } = require("./router/PharmaticRouter");
const { configDatabase } = require("./config/mongoConfig");
const { session } = require("./config/authConfig");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const PORT = 8080;
const secret = "pharmatic";
const app = express();
const start = async () => {
  await configDatabase();
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(secret));
  app.use(express.json());
  app.use(session());
  app.use("/", PharmaticRouter);
  app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
  });
};
start();
