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

const writeJSON = function (title, listID, description) {
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
    peakCount: peaks.length,
    peaks,
    description,
  };
  fs.writeFileSync(
    path.resolve(__dirname, `../json/${listID}.json`),
    JSON.stringify(peakList)
  );
};

writeJSON(
  "Colorado Fourteeners",
  "co14",
  `The Colorado Fourteeners (14ers) are a collection of all summits over 14,000 ft. in elevation with at least 300 ft of topographic prominence across seven mountain ranges within the state of Colorado. Colorado is home to more fourteeners than any other state in the US. The tallest peak, Mt. Elbert, is the second tallest mountain in the lower 48 states.`
);

writeJSON(
  "Maine 4,000 Footers",
  "me4k",
  `The Maine 4,000 Footers are a collection of summits over 4,000 ft. in elevation with at least 200 ft of topographic prominence across four mountain ranges within the state of Maine.The tallest mountain, Mt. Katahdin (Baxter Peak), is the Northern Terminus of the 2,000+ mile Appalachian Trail and the third tallest, Sugarloaf, is a popular ski mountain.`
);

writeJSON(
  "New Hampshire 4,000 Footers",
  "nh4k",
  `The New Hampshire 4,000 Footers (NH 48) are a collection of summits over 4,000 ft. in elevation with at least 200 ft of topographic prominence within the state of New Hampshire. All summits are located within the 800,000 acre White Mountain National Forest. More than 1/3 of the peaks are located directly along or in close proximity to the Appalachian Trail.`
);

writeJSON(
  "Vermont 4,000 Footers",
  "vt4k",
  `The Vermont 4,000 Footers are a collection of summits over 4,000 ft. in elevation with at least 200 ft of topographic prominence within the state of Vermont. All five summits reside along the 272 mile “Long Trail”, the oldest long distance hiking trail in the United States.`
);

writeJSON(
  "New England State Highpoints",
  "neHigh",
  `The New England State Highpoints are a collection of the highest points in each of the six states in New England. The highest point in Connecticut is not a mountain summit, but is on the border of Massachusetts on the slope of Mt. Frissell. It is one of only four states where the highest point is not a mountain summit (KS, DE and DC being the other three).`
);

writeJSON(
  "Adirondack High Peaks",
  "adk46",
  `The Adirondack High Peaks (also known as the "46ers") are a collection of summits within Adirondack Park, the largest state park and largest publicly protected area in the lower 48 states. The original list was thought to contain all peaks over 4,000 ft. in the park, but recent USGS surveys have shown four of the peaks slightly below this threshold.`
);

writeJSON(
  "New England 4,000 Footers",
  "ne4k",
  `The New England 4,000 footers are a collection of summits over 4,000 ft. in elevation with at least 200 ft of topographic prominence spanning across the three northernmost states in New England (Maine, New Hampshire and Vermont).`
);

writeJSON(
  "New England 100 Highest",
  "ne100",
  `The New England 100 Highest are a collection of the one hundred highest mountain summits in New England spanning across the three northernmost states in New England. Fifty-nine (59) of the summits lie in New Hampshire, 27 are in Maine and 14 are in Vermont.`
);

writeJSON(
  "USA State Highpoints",
  "usHigh",
  `The USA State Highpoints are a collection of the highest points in each of the 50 United States plus the District of Columbia. Those actively attempting to complete this list are known as “highpointers”. Eight of the state highpoints are found in National Parks`
);

writeJSON(
  "California Fourteeners",
  "ca14",
  `The California Fourteeners (14ers) are a collection of all summits over 14,000 ft. in elevation with at least 300 ft of topographic prominence within the state of California. The majority of the peaks (10) reside in a concentrated area in the Sierra Nevada Range. California is one of only three states with multiple mountains that meet this criteria (CO and AK being the other two).`
);

writeJSON(
  "Southern Sixers",
  "south6",
  `The Southern Sixers (6ers) are a collection of summits over 6,000 ft. in elevation in the southern Appalachian mountains. All of the peaks are located within 32 miles of the TN/NC border. All mountains have at least 200 ft. of topographic prominence, or there is a distance of at least 0.75 miles between peaks. Other than Mount Washington in New Hampshire, these mountains are the only 6,000 footers east of the Mississippi.`
);

writeJSON(
  "Catskill High Peaks",
  "cat35",
  `The Catskill High Peaks are a collection of summits over 3,500 ft. in elevation located within the 700,000 acre Catskill Park, a forest preserve in the state of New York. All mountains have a topographic prominence of at least 250 ft. or there is a distance of at least 0.5 miles between peaks. 
`
);

writeJSON(
  "New Hampshire 52 With a View",
  "nh52",
  `The New Hampshire 52 With a View are a collection of summits in the state of New Hampshire that are under 4,000 feet in elevation and have excellent views from the summit. This peak list was created by the “Over the Hill Hikers” group as an alternative to the New Hampshire 4,000 footers list. The majority of the peaks reside within the 800,000 acre White Mountain National Forest.`
);
