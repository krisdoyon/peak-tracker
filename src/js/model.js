import { peakListsArr } from "./createPeakLists.js";
import { LogEntry } from "./logEntry.js";
import testData from "../json/testData.json";

export let state = {
  savedLists: [],
  logEntries: [],
  completedPeaks: [],
  listCounts: {},
  currentPreviewView: "all",
  currentLogSelect: "all",
  currentTableSort: "elevation",
};

const getPeakList = function (listID, sortType) {
  const peakList = { ...peakListsArr.find((list) => list.listID === listID) };
  if (sortType === "elevation") {
    peakList.peaks.sort((a, b) => b.elevation - a.elevation);
  }
  if (sortType === "alphabetical") {
    peakList.peaks.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
  }
  if (sortType === "state") {
    peakList.peaks.sort((a, b) =>
      a.state.toLowerCase().localeCompare(b.state.toLowerCase())
    );
  }
  return peakList;
};

const getPeakListsArr = function (previewType = "all") {
  if (previewType === "all") return peakListsArr;
  if (previewType === "saved")
    return [
      ...peakListsArr.filter((list) => state.savedLists.includes(list.listID)),
    ];
};

const setLogID = function () {
  const logID = state.logEntries.length
    ? Math.max(...state.logEntries.map((entry) => entry.logID)) + 1
    : 1;
  return logID;
};

const setLogLists = function (peakIDs) {
  const allTitles = [];
  const allIDs = [];
  peakIDs.forEach((peakID) => {
    increaseListCounts(peakID);
    const listMatchIDs = getMatchingListIDs(peakID);
    listMatchIDs.forEach((listID) => {
      const title = getPeakList(listID).title;
      allTitles.push(title);
      allIDs.push(listID);
    });
  });
  const ids = [...new Set(allIDs)];
  const titles = [...new Set(allTitles)];
  return {
    ids,
    titles,
  };
};

const sortLogEntries = function () {
  state.logEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const getMatchingListIDs = function (peakID) {
  const listMatchIDs = [];
  peakListsArr.forEach((peakList) => {
    if (peakList.peaks.some((peak) => peak.id === peakID)) {
      listMatchIDs.push(peakList.listID);
    }
  });
  return listMatchIDs;
};

const increaseListCounts = function (peakID) {
  const listMatchIDs = getMatchingListIDs(peakID);
  if (!state.completedPeaks.includes(peakID)) {
    state.completedPeaks.push(peakID);
    listMatchIDs.forEach((listID) => {
      state.listCounts[listID] += 1;
    });
  }
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
  localStorage.setItem("state", JSON.stringify(state));
};

const getLocalStorage = function () {
  if (localStorage.state) state = JSON.parse(localStorage.getItem("state"));
};

const initializeListCounts = function () {
  peakListsArr.forEach((list) => {
    if (!state.listCounts[`${list.listID}`])
      state.listCounts[`${list.listID}`] = 0;
  });
};

export const setCurrentPreviewView = function (previewType) {
  state.currentPreviewView = previewType;
};

export const setCurrentLogSelect = function (listID) {
  state.currentLogSelect = listID;
};

export const setCurrentTableSort = function (sortType) {
  state.currentTableSort = sortType;
};

export const getCoords = async function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

export const getCheckboxData = function (listID, checkedID) {
  return {
    listID,
    checkedID: +checkedID || false,
    peaks: getPeakList(listID, "alphabetical").peaks,
  };
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
  const logID = setLogID();
  const lists = setLogLists(data.peakIDs);
  console.log(data);
  const entry = new LogEntry(data, logID, lists);
  state.logEntries.unshift(entry);
  sortLogEntries();
  setLocalStorage();
  console.log(entry);
  return logID;
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

export const getLogEntries = function () {
  const listID = state.currentLogSelect;
  return {
    noEntries: state.logEntries.length ? false : true,
    entries:
      listID === "all"
        ? state.logEntries
        : state.logEntries.filter((entry) => entry.lists.ids.includes(listID)),
  };
};

export const getTableData = function (listID) {
  const list = getPeakList(listID, state.currentTableSort);
  const data = {
    listID: list.listID,
    title: list.title,
    numCompleted: state.listCounts[listID],
    saved: state.savedLists.includes(list.listID) ? true : false,
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
        elevation: peak.elevation,
        state: peak.state,
        completed: logMatch ? true : false,
        completedDate: logMatch ? logMatch.shortDate : false,
      };
    }),
  };
  return data;
};

export const getPreviewData = function () {
  const listArr = getPeakListsArr(state.currentPreviewView);
  const data = listArr.map((list) => {
    return {
      listID: list.listID,
      title: list.title,
      saved: state.savedLists.includes(list.listID) ? true : false,
      numCompleted: state.listCounts[list.listID],
      peakCount: list.peakCount,
    };
  });
  return { previewType: state.currentPreviewView, data };
};

export const getMapData = function (type, id) {
  let peaks, listID;
  if (type === "list") {
    peaks = getPeakList(id).peaks;
    listID = getPeakList(id).listID;
  }
  if (type === "log") {
    peaks = getLogEntry(id).peaks;
  }
  return {
    peaks: peaks.map((peak) => {
      let logMatch;
      if (state.logEntries.length) {
        logMatch = state.logEntries.find((entry) =>
          entry.peaks.some((peakObj) => peakObj.id === peak.id)
        );
      }
      return {
        ...peak,
        completed: state.completedPeaks.includes(peak.id) ? true : false,
        completedDate: logMatch ? logMatch.shortDate : false,
      };
    }),
    listID,
  };
};

export const getSelectData = function () {
  return getPeakListsArr("all").map((list) => {
    return {
      listID: list.listID,
      title: list.title,
    };
  });
};

export const loadTestData = function () {
  if (confirm("Loading test data will overwrite manual changes. Continue?")) {
    state = testData.state;
    setLocalStorage();
    location.reload();
  }
};

export const clearAllData = function () {
  if (confirm("Are you sure you want to clear all data?")) {
    localStorage.clear();
    location.reload();
  }
};

const init = function () {
  getLocalStorage();
  initializeListCounts();
  setLocalStorage();
};

init();
