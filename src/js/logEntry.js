import { peakMap, elevationMap } from "./data/peakLists.js";

export class LogEntry {
  peaks = [];
  id;
  constructor(
    date,
    peakIDsArr,
    listID,
    elevation,
    distance,
    hours,
    min,
    notes,
    rating,
    id
  ) {
    this.date = new Date(date);
    this.peaks = [];
    peakIDsArr.forEach((peakID) =>
      this.peaks.push({
        id: peakID,
        name: peakMap.get(peakID),
        elevation: elevationMap.get(peakID),
      })
    );
    this.listID = listID;
    this.elevation = +elevation;
    this.distance = +distance;
    this.hours = +hours;
    this.min = +min;
    this.notes = notes;
    this.rating = +rating;
    this.id = id;
    this.#init();
    console.log(this);
  }

  #init() {
    const mtnNames = this.peaks.map((peak) => peak.name);
    this.mtnStr =
      mtnNames.length > 1
        ? mtnNames.slice(0, -1).join(", ") + " and " + mtnNames.slice(-1)
        : mtnNames[0];

    this.shortDate = new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      year: "numeric",
      month: "2-digit",
    }).format(this.date);

    this.longDate = new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      year: "numeric",
      month: "long",
    }).format(this.date);

    if (this.hours && this.min)
      this.time = Math.round((this.hours + this.min / 60) * 10) / 10;
    if (this.distance && this.time)
      this.avgSpeed = Math.round((this.distance / this.time) * 10) / 10;
    if (this.elevation && this.distance)
      this.avgElevation = Math.round(this.elevation / this.distance);
  }
}