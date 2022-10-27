import { uniquePeaks } from "./createPeakLists.js";

export class LogEntry {
  constructor(formData, logID, lists) {
    this.peaks = formData.peakIDs.map((peakID) =>
      uniquePeaks.find((peak) => peak.id === peakID)
    );
    this.stats = {
      elevation: +formData.elevation || null,
      distance: +formData.distance || null,
      minutes: +formData.minutes || null,
      hours: +formData.hours || null,
    };
    this.notes = formData.notes || undefined;
    this.rating = +formData.rating || undefined;
    this.logID = logID;
    this.lists = lists;
    this.#setPeakString();
    this.#setDate(formData.date);
    this.#setStats();
  }

  #setPeakString() {
    const peakNames = this.peaks.map((peak) => peak.name);
    this.peakString =
      peakNames.length > 1
        ? peakNames.slice(0, -1).join(", ") + " and " + peakNames.slice(-1)
        : peakNames[0];
  }

  #setDate(date) {
    const fullDate = new Date(`${date}T00:00:00`);
    this.date = {
      fullDate,
      day: new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(
        fullDate
      ),
      month: {
        numeric: new Intl.DateTimeFormat("en-US", { month: "2-digit" }).format(
          fullDate
        ),
        alpha: new Intl.DateTimeFormat("en-US", { month: "long" }).format(
          fullDate
        ),
      },
      year: new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(
        fullDate
      ),
    };
  }

  #setStats() {
    this.stats.time =
      this.stats.hours || this.stats.minutes
        ? Math.round((this.stats.hours + this.stats.minutes / 60) * 10) / 10
        : null;
    this.stats.avgSpeed =
      this.stats.distance && this.stats.time
        ? Math.round((this.stats.distance / this.stats.time) * 10) / 10
        : null;
    this.stats.avgElevation =
      this.stats.elevation && this.stats.distance
        ? Math.round(this.stats.elevation / this.stats.distance)
        : null;
  }
}
