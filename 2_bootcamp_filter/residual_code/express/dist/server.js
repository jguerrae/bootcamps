import express from "express";

import cors from "cors";
//importing routes

import algoliaObject from "./algolia";
const fs = require("fs");
const dataLINK = fs.readFileSync("~/Downloads/data.hr.json");

import cronjobs from "./cronjobs";
require("dotenv").config();

// temp login
process.on("unhandledRejection", ej => {
  throw ej;
});

process.on("uncaughtException", ex => {
  console.log("err", ex);
});

// START APP
const server = express();
server.use(cors());
// HANDLING CORS
server.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Request-Method", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization,cache-control, klaus-locale");

  if ("OPTIONS" == req.method) {
    res.header("Access-Control-Max-Age", 3600);

    res.sendStatus(200).end();
  } else {
    next();
  }
});
const file =
// STARTING MONGO
console.log("Starting MongoDB");

//mongodbConfig.init(server)

// MIGRATING DATA, if necesary

// STARTING CRONJOBS
console.log("Starting cronjobs");
cronjobs.start();

// SETTING PASSPORT STRATEGIES
passportConfig.init(server);

server.use(morgan("combined"));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// SETTING ROUTES

server.get("/", function (req, res) {
  console.log("Lo", dataLINK);
  res.status(200).json({ Hello: "Missing route" });
});

server.get("*", function (req, res) {
  res.status(404).json({ error: "Missing route" });
});
console.log("envi", process.env.PORT, process.env.NODE_ENV);
const PORT = process.env.PORT || 49002; // 8080; //
const IP = process.env.IP || "127.0.0.1"; // 8080; //

server.listen(PORT, IP, () => {
  console.log(`App listening on port ${PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Process terminated");
  });
});