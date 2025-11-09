// src/utils/csvHandler.js
import fs from "fs";
import { Parser } from "json2csv";
import csv from "csv-parser";

export const exportToCSV = (data, filePath) => {
  const json2csvParser = new Parser();
  const csvData = json2csvParser.parse(data);
  fs.writeFileSync(filePath, csvData);
  return filePath;
};

export const importFromCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};
