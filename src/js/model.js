import { peakListsArr } from "./data/peakLists.js";
import { LogEntry } from "./logEntry.js";

export const state = {
  savedLists: [],
  logEntries: [],
  completedPeaks: [],
  listCounts: {},
  currentListView: "all",
};

export const setCurrentListView = function (previewType) {
  state.currentListView = previewType;
};

export const getCoords = async function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

export const getPeakList = function (listID) {
  return peakListsArr.find((list) => list.listID === listID);
};

export const getPeakListsArr = function (previewType = "all") {
  if (previewType === "all") return peakListsArr;
  if (previewType === "saved")
    return peakListsArr.filter((list) =>
      state.savedLists.includes(list.listID)
    );
};

export const sortPeakList = function (listID, sortType) {
  const list = getPeakList(listID);
  if (sortType === "elevation") {
    list.peaks.sort((a, b) => b.elevFeet - a.elevFeet);
  }
  if (sortType === "alphabetical") {
    list.peaks.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
  }
};

export const getCheckboxDisplayArr = function (listID) {
  sortPeakList(listID, "alphabetical");
  const listArr = getPeakList(listID).peaks;
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
  const logID = state.logEntries.length
    ? Math.max(...state.logEntries.map((entry) => entry.logID)) + 1
    : 1;
  const entry = new LogEntry(...data, logID);
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
  return state.logEntries.find((entry) => entry.logID === logID);
};

export const getTableData = function (listID) {
  const list = getPeakList(listID);
  const data = {
    listID: list.listID,
    title: list.title,
    numCompleted: state.listCounts[listID],
    peakCount: list.peakCount,
    peaks: list.peaks.map((peak, i) => {
      let logMatch;
      if (state.logEntries.length) {
        logMatch = state.logEntries.find((entry) =>
          entry.peaks.some((peakObj) => peakObj.id === peak.id)
        );
      }
      return {
        id: peak.id,
        num: i + 1,
        name: peak.name,
        elevation: peak.elevFeet,
        state: peak.state,
        completed: logMatch ? true : false,
        completedDate: logMatch ? logMatch.shortDate : false,
      };
    }),
  };
  return data;
};

export const getPreviewData = function () {
  const listArr = getPeakListsArr(state.currentListView);
  const data = listArr.map((list) => {
    return {
      listID: list.listID,
      title: list.title,
      saved: state.savedLists.includes(list.listID) ? true : false,
      numCompleted: state.listCounts[list.listID],
      peakCount: list.peakCount,
    };
  });
  return { previewType: state.currentListView, data };
};

export const getMapData = function (listID) {
  const list = getPeakList(listID);
  return {
    peaks: list.peaks.map((peak) => {
      return {
        id: peak.id,
        name: peak.name,
        lat: peak.lat,
        long: peak.long,
        completed: state.completedPeaks.includes(peak.id) ? true : false,
        elevation: peak.elevFeet,
      };
    }),
    center: list.center,
    zoom: list.zoom,
    listID: list.listID,
  };
};

console.log(getPeakList("nh4k"));

const sortLogEntries = function () {
  state.logEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const increaseListCounts = function (peakID) {
  peakListsArr.forEach((peakListObj) => {
    if (!state.completedPeaks.includes(peakID)) {
      if (peakListObj.peaks.some((peak) => peak.id === peakID)) {
        state.listCounts[`${peakListObj.listID}`] += 1;
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
        peaklistObj.peaks.some((peak) => peak.id === peakID)
      )
      .map((peakList) => peakList.listID)
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
    if (!state.listCounts[`${list.listID}`])
      state.listCounts[`${list.listID}`] = 0;
  });
};

const init = function () {
  getLocalStorage();
  initializeListCounts();
  setLocalStorage();
};

init();
