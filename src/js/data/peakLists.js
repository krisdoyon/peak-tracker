import { adk46Arr } from "./peak-lists/adk46.js";
import { co14Arr } from "./peak-lists/co14.js";
import { me4kArr } from "./peak-lists/me4k.js";
import { ne100restArr } from "./peak-lists/ne100rest.js";
import { neHighArr } from "./peak-lists/neHigh.js";
import { nh4kArr } from "./peak-lists/nh4k.js";
import { vt4kArr } from "./peak-lists/vt4k.js";

class PeakList {
  markers = [];
  constructor(title, id, data, center, zoom) {
    this.title = title;
    this.id = id;
    this.data = data;
    this.peakCount = data.length;
    this.center = center;
    this.zoom = zoom;
  }
}

const co14 = new PeakList(
  "Colorado 14ers",
  "co14",
  co14Arr,
  [38.76958342598271, -108.5459199218751],
  8
);

const me4k = new PeakList(
  "Maine 4,000 Footers",
  "me4k",
  me4kArr,
  [45.11352900692261, -72.22412109375001],
  8
);

const nh4k = new PeakList(
  "New Hampshire 4,000 Footers",
  "nh4k",
  nh4kArr,
  [44.20681942220478, -72.09640502929689],
  10
);

const vt4k = new PeakList(
  "Vermont 4,000 Footers",
  "vt4k",
  vt4kArr,
  [44.08363928284644, -74.08355712890626],
  9
);

const neHigh = new PeakList(
  "New England State Highpoints",
  "neHigh",
  neHighArr,
  [43.739352079154706, -76.03637695312501],
  7
);

const adk46 = new PeakList(
  "Adirondack High Peaks",
  "adk46",
  adk46Arr,
  [44.09153051045221, -74.57519531250001],
  10
);

const ne4k = new PeakList(
  "New England 4,000 Footers",
  "ne4k",
  [...nh4k.data, ...me4k.data, ...vt4k.data],
  [44.54350521320822, -73.39753417968751],
  8
);

const ne100 = new PeakList(
  "New England 100 Highest",
  "ne100",
  [...ne4k.data, ...ne100restArr],
  [44.54350521320822, -73.39753417968751],
  8
);

const peakListsArr = [co14, me4k, nh4k, vt4k, neHigh, adk46, ne4k, ne100];

const all = new PeakList(
  "All Peaks",
  "all",
  [...new Set(peakListsArr.flatMap((peakList) => peakList.data))],
  [39.63953756436671, -107.7978515625],
  5
);

peakListsArr.push(all);

const peakMap = new Map();

const elevationMap = new Map();

all.data.forEach((peakObj) => {
  peakMap.set(peakObj.id, peakObj.name);
});

all.data.forEach((peakObj) => elevationMap.set(peakObj.id, peakObj.elevFeet));

peakListsArr.sort((a, b) =>
  a.title.toLowerCase().localeCompare(b.title.toLowerCase())
);
export { peakListsArr, peakMap, elevationMap };
