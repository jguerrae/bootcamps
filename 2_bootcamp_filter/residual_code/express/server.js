//importing routes

const algoliaObject = require("./algolia");
const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
//const dataLINK = fs.readFileSync("./data.hr.json");
const filePath = "./../DF_BOOTCAMPS_2591.csv";
console.log("HH", __dirname, path.resolve(__dirname, ".."));
const vL = [];

const mapValues = ({ header, index, value }) => {
  //console.log(isHead ? "head" : "value", value, index, header);
  //ithreturn value;
  switch (header) {
    case "certifications":
      // base and variant case

      return value;

    case "education":
      const vaParsed = JSON.parse(value);
      console.log(typeof value);
      return value;

    default:
      return null;
  }
};
fs.createReadStream(filePath)
  .on("error", (error) => {
    // handle error
    console.log("ERROR", error);
  })
  .pipe(
    csvParser({
      //headers: true,
      /* skipLines: 1,
    mapHeaders: ({ header, index }) =>
      mapValuesAndHeaders({ header, index, value: "head" }),
    */
      mapValues,
    })
  )
  .on("data", (line) => {
    console.log("line", line);
    vL.push(line);
  })
  .on("end", async () => {});

console.log("dat");
