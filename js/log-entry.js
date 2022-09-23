"use strict";

class LogEntry {
  peaks = [];
  id;
  constructor(
    date,
    peaks,
    listID,
    elevation,
    distance,
    hours,
    min,
    notes,
    rating
  ) {
    this.date = date;
    peaks.forEach((peak) => this.peaks.push(peak));
    this.listID = listID;
    this.elevation = +elevation;
    this.distance = +distance;
    this.hours = +hours;
    this.min = +min;
    this.notes = notes;
    this.rating = rating;
    this.init();
  }

  init() {
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
    if (currentUser.logEntries.length) {
      const curMaxID = Math.max(
        ...currentUser.logEntries.map((entry) => entry.id)
      );
      this.id = curMaxID + 1;
    } else {
      this.id = 1;
    }
  }
}
