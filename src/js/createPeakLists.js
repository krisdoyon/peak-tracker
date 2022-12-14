import adk46JSON from "../json/adk46.json";
import ca14JSON from "../json/ca14.json";
import cat35JSON from "../json/cat35.json";
import co14JSON from "../json/co14.json";
import me4kJSON from "../json/me4k.json";
import ne100JSON from "../json/ne100.json";
import ne4kJSON from "../json/ne4k.json";
import neHighJSON from "../json/neHigh.json";
import nh4kJSON from "../json/nh4k.json";
import nh52JSON from "../json/nh52.json";
import south6JSON from "../json/south6.json";
import vt4kJSON from "../json/vt4k.json";
import usHighJSON from "../json/usHigh.json";

class PeakList {
  constructor(data) {
    this.title = data.title;
    this.listID = data.listID;
    this.peakCount = data.peakCount;
    this.peaks = data.peaks;
    this.description = data.description;
  }
}

const adk46 = new PeakList(adk46JSON);
const ca14 = new PeakList(ca14JSON);
const cat35 = new PeakList(cat35JSON);
const co14 = new PeakList(co14JSON);
const me4k = new PeakList(me4kJSON);
const ne100 = new PeakList(ne100JSON);
const ne4k = new PeakList(ne4kJSON);
const neHigh = new PeakList(neHighJSON);
const nh4k = new PeakList(nh4kJSON);
const nh52 = new PeakList(nh52JSON);
const south6 = new PeakList(south6JSON);
const vt4k = new PeakList(vt4kJSON);
const usHigh = new PeakList(usHighJSON);

const peakListsArr = [
  adk46,
  ca14,
  cat35,
  co14,
  me4k,
  ne100,
  ne4k,
  neHigh,
  nh4k,
  nh52,
  south6,
  vt4k,
  usHigh,
];

const uniquePeaks = [
  ...new Map(
    peakListsArr
      .flatMap((peakList) => peakList.peaks)
      .map((peak) => [peak.id, peak])
  ).values(),
];

peakListsArr.sort((a, b) =>
  a.title.toLowerCase().localeCompare(b.title.toLowerCase())
);

export { peakListsArr, uniquePeaks };
