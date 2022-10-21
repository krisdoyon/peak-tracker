import adk46JSON from "../json/adk46.json";
import co14JSON from "../json/co14.json";
import me4kJSON from "../json/me4k.json";
import ne100JSON from "../json/ne100.json";
import ne4kJSON from "../json/ne4k.json";
import neHighJSON from "../json/neHigh.json";
import nh4kJSON from "../json/nh4k.json";
import vt4kJSON from "../json/vt4k.json";
import allJSON from "../json/all";

class PeakList {
  constructor(data) {
    this.title = data.title;
    this.listID = data.listID;
    this.center = data.center;
    this.zoom = data.zoom;
    this.peakCount = data.peakCount;
    this.peaks = data.peaks;
  }
}

const adk46 = new PeakList(adk46JSON);
const co14 = new PeakList(co14JSON);
const me4k = new PeakList(me4kJSON);
const ne100 = new PeakList(ne100JSON);
const ne4k = new PeakList(ne4kJSON);
const neHigh = new PeakList(neHighJSON);
const nh4k = new PeakList(nh4kJSON);
const vt4k = new PeakList(vt4kJSON);

const peakListsArr = [adk46, co14, me4k, ne100, ne4k, neHigh, nh4k, vt4k];

const all = new PeakList(allJSON);

const allPeaks = peakListsArr.flatMap((peakList) => peakList.peaks);
const uniquePeaks = [
  ...new Map(allPeaks.map((peak) => [peak.id, peak])).values(),
];

all.peaks = uniquePeaks;
all.peakCount = uniquePeaks.length;
peakListsArr.push(all);

const peakMap = new Map();

const elevationMap = new Map();

all.peaks.forEach((peak) => {
  peakMap.set(peak.id, peak.name);
});

all.peaks.forEach((peak) => elevationMap.set(peak.id, peak.elevFeet));

peakListsArr.sort((a, b) =>
  a.title.toLowerCase().localeCompare(b.title.toLowerCase())
);

export { peakListsArr, peakMap, elevationMap };
