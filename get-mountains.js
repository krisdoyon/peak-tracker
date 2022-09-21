const fs = require("fs");

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

const nh4knames = [
  "Mount Washington",
  "Mount Adams",
  "Mount Jefferson",
  "Mount Monroe",
  "Mount Madison",
  "Mount Lafayette",
  "Mount Lincoln",
  "South Twin Mountain",
  "Carter Dome",
  "Mount Moosilauke",
  "Mount Eisenhower",
  "North Twin Mountain",
  "Mount Carrigain",
  "Mount Bond",
  "Middle Carter Mountain",
  "West Bond",
  "Mount Garfield",
  "Mount Liberty",
  "South Carter Mountain",
  "Wildcat Mountain (A peak)",
  "Mount Hancock",
  "South Peak Kinsman Mountain",
  "Mount Field",
  "Mount Osceola",
  "Mount Flume",
  // "South Hancock",
  "Mount Pierce",
  // "North Kinsman",
  "Mount Willey",
  "Bondcliff",
  // "Zealand Mountain"
  "Mount Tripyramid",
  "Mount Cabot",
  "East Peak",
  "Middle Peak",
  "Cannon Mountain",
  "Mount Hale",
  "Mount Jackson",
  "Mount Tom",
  "Wildcat Mountain (D peak)",
  "Mount Moriah",
  "Mount Passaconaway",
  // "Owls Head",
  "Galehead Mountain",
  "Mount Whiteface",
  "Mount Waumbek",
  "Mount Isolation",
  "Mount Tecumseh",
];

const neHighNames = [
  "Mount Washington",
  "Mount Katahdin",
  "Mount Mansfield",
  "Bear Mountain",
  "Mount Greylock",
  "Jerimoth Hill",
];

const vt4kNames = [
  "Mount Mansfield",
  "Killington Peak",
  "Camels Hump",
  "Mount Ellen",
  "Mount Abraham",
];

const me4kNames = [];

const co14Names = [];

const nh52wavNames = [];

const allStateHighNames = [];

const ne100HighestNames = [];

const adk4kNames = [];

class Mountain {
  constructor(mtnArr, labels) {
    this.name = mtnArr[labels.indexOf("FEATURE_NAME")];
    this.lat = mtnArr[labels.indexOf("PRIM_LAT_DEC")];
    this.long = mtnArr[labels.indexOf("PRIM_LONG_DEC")];
    this.elevFeet = mtnArr[labels.indexOf("ELEV_IN_FT")];
    this.elevMeters = mtnArr[labels.indexOf("ELEV_IN_M")];
    this.state = mtnArr[labels.indexOf("STATE_ALPHA")];
  }
}

// Gets data from main features file, writes only lines that match mountains in provided mtnsArr
// *****USING THIS FUNCTION WILL OVERWRITE MANUAL CHANGES*****
function writeGNISData(mtnsArr, inputFile, outputFile) {
  // Read the file contents
  const contents = fs.readFileSync(inputFile, "utf-8");
  // Create an array of the contents with one feature as each element
  const contentsArr = contents.split(/\r\n/);
  // Get the labels (first row of file)
  let fileString = "";
  mtnsArr
    .map((mtn) => contentsArr.find((entry) => entry.includes(`|${mtn}|Summit`)))
    .forEach((str) => (fileString += `${str}\r\n`));
  fs.writeFileSync(outputFile, fileString);
}

// writeGNISData(vt4kNames, "./txt/vt_features.txt", "./txt/vt4k.txt");

const createObjectsFile = function (inputFile, outputFile) {
  contents = fs.readFileSync(inputFile, "utf-8");
  const rows = contents.split(/\r\n/);
  const mtnsRows = contents
    .split(/\r\n/)
    .map((mtn) => mtn.split("|"))
    .map(function (arr) {
      return new Mountain(arr, labels);
    });
  mtnsRows.splice(-1);
  fs.writeFileSync(outputFile, JSON.stringify(mtnsRows));
};

// createObjectsFile("./txt/neHigh.txt", "./js/neHigh.js");
