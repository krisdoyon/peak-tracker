import { uniquePeaks } from "./createPeakLists.js";

export class LogEntry {
  peaks = [];
  constructor(formData, logID, lists) {
    this.date = new Date(formData.date);
    formData.peakIDs.forEach((peakID) =>
      this.peaks.push(uniquePeaks.find((peak) => peak.id === peakID))
    );
    this.stats = {
      elevation: +formData.elevation,
      distance: +formData.distance,
      minutes: +formData.minutes,
      hours: +formData.hours,
    };
    this.notes = formData.notes;
    this.rating = +formData.rating;
    this.logID = logID;
    this.lists = lists;
    this.#init();
  }

  #init() {
    const peakNames = this.peaks.map((peak) => peak.name);
    this.peakString =
      peakNames.length > 1
        ? peakNames.slice(0, -1).join(", ") + " and " + peakNames.slice(-1)
        : peakNames[0];

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
