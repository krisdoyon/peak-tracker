const fs = require("fs");
const path = require("path");

let labels = [
  "FEATURE_ID",
  "FEATURE_NAME",
  "FEATURE_CLASS",
  "STATE_ALPHA",
  "STATE_NUMERIC",
  "COUNTY_NAME",
  "COUNTY_NUMERIC",
  "PRIMARY_LAT_DMS",
  "PRIM_LONG_DMS",
  "PRIM_LAT_DEC",
  "PRIM_LONG_DEC",
  "SOURCE_LAT_DMS",
  "SOURCE_LONG_DMS",
  "SOURCE_LAT_DEC",
  "SOURCE_LONG_DEC",
  "ELEV_IN_M",
  "ELEV_IN_FT",
  "MAP_NAME",
  "DATE_CREATED",
  "DATE_EDITED",
];

class Mountain {
  constructor(mtnArr, labels) {
    this.id = Number(mtnArr[labels.indexOf("FEATURE_ID")]);
    this.name = mtnArr[labels.indexOf("FEATURE_NAME")];
    this.lat = Number(mtnArr[labels.indexOf("PRIM_LAT_DEC")]);
    this.long = Number(mtnArr[labels.indexOf("PRIM_LONG_DEC")]);
    this.elevation = Number(mtnArr[labels.indexOf("ELEV_IN_FT")]);
    this.state = mtnArr[labels.indexOf("STATE_ALPHA")];
  }
}

// Gets data from main features file, writes only lines that match mountains in provided mtnsArr
// *****USING THIS FUNCTION WILL OVERWRITE MANUAL CHANGES*****
function writeGNISData(mtnsArr, state, id) {
  // Read the file contents
  const contents = fs.readFileSync(
    `./txt/GNIS-features-files/${state}_features.txt`,
    "utf-8"
  );
  // Create an array of the contents with one feature as each element
  const contentsArr = contents.split(/\r\n/);
  // Get the labels (first row of file)
  let fileString = "";
  mtnsArr
    .map((mtn) => contentsArr.find((entry) => entry.includes(`|${mtn}|Summit`)))
    .forEach((str) => (fileString += `${str}\r\n`));
  fs.writeFileSync(`./txt/${id}.txt`, fileString);
}

// writeGNISData(ne100HighestNamesVT, "vt", "ne100vt");

const writeJSON = function (title, listID, center, zoom) {
  const contents = fs.readFileSync(
    path.resolve(__dirname, `../txt/${listID}.txt`),
    "utf-8"
  );
  const peaks = contents
    .split(/\r\n/)
    .map((mtn) => mtn.split("|"))
    .map((arr) => new Mountain(arr, labels));

  const peakList = {
    title,
    listID,
    center,
    zoom,
    peakCount: peaks.length,
    peaks: peaks,
  };
  fs.writeFileSync(
    path.resolve(__dirname, `../json/${listID}.json`),
    JSON.stringify(peakList)
  );
};

writeJSON("Colorado 14ers", "co14", [38.7695, -108.5459], 8);
writeJSON("Maine 4,000 Footers", "me4k", [45.1135, -72.2241], 8);
writeJSON("New Hampshire 4,000 Footers", "nh4k", [44.2068, -72.0964], 10);
writeJSON("Vermont 4,000 Footers", "vt4k", [44.0836, -74.0835], 9);
writeJSON("New England State Highpoints", "neHigh", [43.73935, -76.0363], 7);
writeJSON("Adirondack High Peaks", "adk46", [44.0915, -74.5751], 10);
writeJSON("New England 4,000 Footers", "ne4k", [44.5435, -73.3975], 8);
writeJSON("New England 100 Highest", "ne100", [44.5435, -73.3975], 8);
