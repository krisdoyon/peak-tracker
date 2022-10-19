import { peakListsArr } from "./data/peakLists.js";
import { LogEntry } from "./logEntry.js";

export const state = {
  savedLists: [],
  logEntries: [],
  completedPeaks: [],
  listCounts: {},
  currentListView: "all",
};

export const getCoords = async function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

export const getPeakList = function (listID) {
  return peakListsArr.find((list) => list.id === listID);
};

export const getPeakListsArr = function (type = "all") {
  if (type === "all") return peakListsArr;
  if (type === "saved")
    return peakListsArr.filter((list) => state.savedLists.includes(list.id));
};

export const sortPeakList = function (listID, sortType) {
  const list = getPeakList(listID);
  if (sortType === "elevation") {
    list.data.sort((a, b) => b.elevFeet - a.elevFeet);
  }
  if (sortType === "alphabetical") {
    list.data.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
  }
};

export const getCheckboxDisplayArr = function (listID) {
  sortPeakList(listID, "alphabetical");
  const listArr = getPeakList(listID).data;
  const firstHalf = listArr.slice(0, Math.ceil(listArr.length / 2));
  const secondHalf = listArr.slice(Math.ceil(listArr.length / 2));
  const displayArr = [];
  for (const [i, _] of listArr.entries()) {
    firstHalf[i] && displayArr.push(firstHalf[i]);
    secondHalf[i] && displayArr.push(secondHalf[i]);
  }
  return displayArr;
};

export const getDate = function (date) {
  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  const now = new Date();
  if (date === "today")
    return new Intl.DateTimeFormat("en-CA", options).format(now);
  if (date === "yesterday")
    return new Intl.DateTimeFormat("en-CA", options).format(
      new Date(now.getTime() - 86400000)
    );
};

export const addSavedList = function (listID) {
  state.savedLists.push(listID);
  setLocalStorage();
};

export const removeSavedList = function (listID) {
  state.savedLists.splice(state.savedLists.indexOf(listID), 1);
  setLocalStorage();
};

export const addLogEntry = function (data) {
  const id = state.logEntries.length
    ? Math.max(...state.logEntries.map((entry) => entry.id)) + 1
    : 1;

  const entry = new LogEntry(...data, id);
  state.logEntries.unshift(entry);
  entry.peaks.forEach((peak) => {
    increaseListCounts(peak.id);
    if (!state.completedPeaks.includes(peak.id)) {
      state.completedPeaks.push(peak.id);
    }
  });
  sortLogEntries();
  setLocalStorage();
};

export const removeLogEntry = function (logID) {
  const remove = getLogEntry(logID);
  state.logEntries.splice(state.logEntries.indexOf(remove), 1);
  remove.peaks.forEach((peak) => {
    decreaseListCounts(peak.id);
  });
  setLocalStorage();
};

export const getLogEntry = function (logID) {
  return state.logEntries.find((entry) => entry.id === logID);
};

const sortLogEntries = function () {
  state.logEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const increaseListCounts = function (peakID) {
  peakListsArr.forEach((peakListObj) => {
    if (!state.completedPeaks.some((id) => id === peakID)) {
      if (peakListObj.data.some((peakObj) => peakObj.id === peakID)) {
        state.listCounts[`${peakListObj.id}`] += 1;
      }
    }
  });
};

const decreaseListCounts = function (peakID) {
  if (
    !state.logEntries
      .flatMap((entry) => entry.peaks)
      .some((peak) => peak.id === peakID)
  ) {
    state.completedPeaks.splice(state.completedPeaks.indexOf(peakID), 1);
    peakListsArr
      .filter((peaklistObj) =>
        peaklistObj.data.some((peakObj) => peakObj.id === peakID)
      )
      .map((peakList) => peakList.id)
      .forEach((peakListID) => state.listCounts[peakListID]--);
  }
};

const setLocalStorage = function () {
  localStorage.setItem("logEntries", JSON.stringify(state.logEntries));
  localStorage.setItem("completedPeaks", JSON.stringify(state.completedPeaks));
  localStorage.setItem("listCounts", JSON.stringify(state.listCounts));
  localStorage.setItem("savedLists", JSON.stringify(state.savedLists));
};

const getLocalStorage = function () {
  if (localStorage.logEntries)
    state.logEntries = JSON.parse(localStorage.getItem("logEntries"));
  if (localStorage.completedPeaks)
    state.completedPeaks = JSON.parse(localStorage.getItem("completedPeaks"));
  if (localStorage.listCounts)
    state.listCounts = JSON.parse(localStorage.getItem("listCounts"));
  if (localStorage.savedLists)
    state.savedLists = JSON.parse(localStorage.getItem("savedLists"));
};

const initializeListCounts = function () {
  peakListsArr.forEach((list) => {
    if (!state.listCounts[`${list.id}`]) state.listCounts[`${list.id}`] = 0;
  });
};

const init = function () {
  initializeListCounts();
  getLocalStorage();
};

init();
