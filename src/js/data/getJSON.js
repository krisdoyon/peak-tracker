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

const co14Names = [
  "Mount Elbert",
  "Mount Massive",
  "Mount Harvard",
  "Blanca Peak",
  "La Plata Peak",
  "Uncompahgre Peak",
  // "Mount Lincoln",
  "Grays Peak",
  // "Castle Peak",
  "Quandary Peak",
  "Torreys Peak",
  "Mount Antero",
  // "Mount Evans",
  "Longs Peak",
  "Mount Wilson",
  "Mount Cameron",
  "Mount Shavano",
  "Mount Belford",
  "Mount Princeton",
  "Mount Yale",
  "Crestone Needle",
  "Mount Bross",
  "El Diente Peak",
  "Kit Carson Mountain",
  // "Maroon Peak",
  "Mount Oxford",
  "Tabeguache Peak",
  "Mount Sneffels",
  "Mount Democrat",
  "Capitol Peak",
  "Pikes Peak",
  "Snowmass Mountain",
  "Windom Peak",
  "Mount Eolus",
  "Challenger Point",
  "Mount Columbia",
  "Missouri Mountain",
  "Humboldt Peak",
  "Mount Bierstadt",
  // "Sunlight Peak"
  "Handies Peak",
  "Ellingwood Point",
  "Mount Lindsey",
  "Culebra Peak",
  "Mount Sherman",
  "North Eolus",
  "Little Bear Peak",
  "Redcloud Peak",
  "Conundrum Peak",
  // "Pyramid Peak",
  "San Luis Peak",
  "North Maroon Peak",
  "Wetterhorn Peak",
  "Wilson Peak",
  "Mount of the Holy Cross",
  "Huron Peak",
  "Sunshine Peak",
];

const me4kNames = [
  "Baxter Peak",
  "Hamlin Peak",
  // "Sugarloaf Mountain",
  "Crocker Mountain",
  "Old Speck Mountain",
  "North Brother",
  // "Mount Bigelow (West Peak)",
  // "Saddleback Mountain",
  "Avery Peak",
  "Mount Abraham",
  "South Crocker Mountain",
  "The Horn",
  "Mount Redington",
  "Spaulding Mountain",
];

const nh52wavNames = [];

const allStateHighNames = [];

const ne100HighestNamesNH = [
  "Sandwich Mountain",
  "The Bulge",
  "Mount Nancy",
  "The Horn",
  "Mount Weeks",
  // "South Weeks",
  "Vose Spur",
  "East Sleeper",
  // "Peak Above the Nubble",
  "Scar Ridge",
  "The Cannon Balls",
];

const ne100HighestNamesME = [
  "South Brother",
  // "Snow Mountain",
  "Goose Eye Mountain",
  "Fort Mountain",
  "White Cap Mountain",
  // "Boundary Peak",
  "The Horns",
  "Mount Coe",
  "East Kennebago Mountain",
  // "Snow Mountain",
  "Baldpate Mountain",
  "Kennebago Divide",
  "Elephant Mountain",
];

const ne100HighestNamesVT = [
  "Pico Peak",
  "Stratton Mountain",
  "Jay Peak",
  "Equinox Mountain",
  "Mendon Peak",
  "Bread Loaf Mountain",
  "Mount Wilson",
  "Big Jay",
  "Dorset Mountain",
];

const adk46Names = [
  "Mount Marcy",
  "Algonquin Peak",
  "Mount Haystack",
  "Mount Skylight",
  "Whiteface Mountain",
  "Dix Mountain",
  "Gray Peak",
  "Iroquois Peak",
  "Basin Mountain",
  "Gothics",
  "Mount Colden",
  "Giant Mountain",
  "Nippletop",
  "Santanoni Peak",
  "Mount Redfield",
  "Wright Peak",
  // "Saddleback Mountain",
  "Panther Peak",
  "Table Top Mountain",
  "Rocky Peak",
  "Macomb Mountain",
  // "Armstrong Mountain",
  "Hough Peak",
  "Seward Mountain",
  "Mount Marshall",
  "Allen Mountain",
  "Big Slide Mountain",
  "Esther Mountain",
  "Upper Wolfjaw Mountain",
  "Lower Wolfjaw Mountain",
  "Street Mountain",
  "Phelps Mountain",
  "Donaldson Mountain",
  "Seymour Mountain",
  "Sawteeth",
  // "Cascade Mountain",
  "South Dix",
  "Porter Mountain",
  "Mount Colvin",
  "Mount Emmons",
  "Grace Peak",
  "Blake Peak",
  "Cliff Mountain",
  "Nye Mountain",
  "Couchsachraga Peak",
  "Dial Mountain",
];

class Mountain {
  constructor(mtnArr, labels) {
    this.id = Number(mtnArr[labels.indexOf("FEATURE_ID")]);
    this.name = mtnArr[labels.indexOf("FEATURE_NAME")];
    this.lat = Number(mtnArr[labels.indexOf("PRIM_LAT_DEC")]);
    this.long = Number(mtnArr[labels.indexOf("PRIM_LONG_DEC")]);
    this.elevFeet = Number(mtnArr[labels.indexOf("ELEV_IN_FT")]);
    this.elevMeters = Number(mtnArr[labels.indexOf("ELEV_IN_M")]);
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

const createObjectsFile = function (id) {
  contents = fs.readFileSync(`./txt/${id}.txt`, "utf-8");
  const rows = contents.split(/\r\n/);
  const mtnsRows = contents
    .split(/\r\n/)
    .map((mtn) => mtn.split("|"))
    .map(function (arr) {
      return new Mountain(arr, labels);
    });
  mtnsRows.splice(-1);
  const writeString = `let ${id} = ` + JSON.stringify(mtnsRows);
  fs.writeFileSync(`./js/peak-lists/${id}.js`, writeString);
};

// const ids = [
// "co14",
// "me4k",
// "neHigh",
// "nh4k",
// "vt4k",
// "adk46",
// "nre100rest"
// ];

// ids.forEach((id) => createObjectsFile(id));

// createObjectsFile("ne100rest");
