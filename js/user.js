"use strict";

class User {
  savedLists = [];
  logEntries = [];
  completedPeaks = [];
  listCounts = {};
  coords;
  constructor(firstName, username) {
    this.firstName = firstName;
    this.username = username;
    this.locale = navigator.locale;
    this.listCounts = {};

    this._getLocalStorage();
    this._initializeListCounts();
  }

  addLogEntry(entry) {
    this.logEntries.unshift(entry);
    entry.peaks.forEach((peakID) => {
      this._updateListCounts(peakID);
      if (!this.completedPeaks.includes(peakID)) {
        this.completedPeaks.push(peakID);
      }
    });

    this._setLocalStorage();
  }

  removeLogEntry(logID) {
    const removeObj = this.logEntries.find((entry) => entry.id === logID);
    this.logEntries.splice(this.logEntries.indexOf(removeObj), 1);
    removeObj.peaks.forEach((peak) => {
      this._decreaseListCounts(peak);
    });
    this._setLocalStorage();
  }

  addSavedList(listID) {
    this.savedLists.push(listID);
    this._setLocalStorage();
  }

  removeSavedList(listID) {
    this.savedLists.splice(this.savedLists.indexOf(listID), 1);
    this._setLocalStorage();
  }

  sortLogEntries() {
    this.logEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  _setLocalStorage() {
    localStorage.setItem("logEntries", JSON.stringify(this.logEntries));
    localStorage.setItem("completedPeaks", JSON.stringify(this.completedPeaks));
    localStorage.setItem("listCounts", JSON.stringify(this.listCounts));
    localStorage.setItem("savedLists", JSON.stringify(this.savedLists));
  }

  _getLocalStorage() {
    if (localStorage.logEntries)
      this.logEntries = JSON.parse(localStorage.getItem("logEntries"));
    if (localStorage.completedPeaks)
      this.completedPeaks = JSON.parse(localStorage.getItem("completedPeaks"));
    if (localStorage.listCounts)
      this.listCounts = JSON.parse(localStorage.getItem("listCounts"));
    if (localStorage.savedLists)
      this.savedLists = JSON.parse(localStorage.getItem("savedLists"));
  }

  _initializeListCounts() {
    peakListsArr.forEach((peakListObj) => {
      if (!this.listCounts[`${peakListObj.id}`])
        this.listCounts[`${peakListObj.id}`] = 0;
    });
  }

  _updateListCounts(peakID) {
    peakListsArr.forEach((peakListObj) => {
      if (!this.completedPeaks.some((id) => id === peakID)) {
        if (peakListObj.data.some((peakObj) => peakObj.id === peakID)) {
          this.listCounts[`${peakListObj.id}`] += 1;
        }
      }
    });
  }

  _decreaseListCounts(peakID) {
    // Loop through log entires array, flatmap all peaks from each log entry.

    // If the flatmap contains any value that matches the peak, the user has climbed the mountain in another post

    // No peak list count

    if (
      !currentUser.logEntries
        .flatMap((entry) => entry.peaks)
        .some((id) => id === peakID)
    ) {
      this.completedPeaks.splice(this.completedPeaks.indexOf(peakID), 1);
      peakListsArr
        .filter((peaklistObj) =>
          peaklistObj.data.some((peakObj) => peakObj.id === peakID)
        )
        .map((peakList) => peakList.id)
        .forEach((peakListID) => currentUser.listCounts[peakListID]--);
    }
  }
}
