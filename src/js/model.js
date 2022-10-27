import { peakListsArr } from "./createPeakLists.js";
import { LogEntry } from "./logEntry.js";
import testData from "../json/testData.json";

// STATE

export let state = {
  listCounts: {},
  allLogEntries: [],
  noEntries: true,
  completedPeaks: [],
  savedLists: [],
  sidebarHidden: false,
  allSelectValues: { lists: "", months: "", years: "" },
  peakPreview: {
    previewType: "all",
    data: {},
    page: 1,
    resPerPage: 6,
  },
  peakTable: {
    sortType: "elevation",
    data: {},
  },
  logPreview: {
    curSelectValues: { listID: "all", month: "all", year: "all" },
    entries: [],
    page: 1,
    resPerPage: 6,
  },
  curLogEntry: {},
  stats: {
    curSelectValues: { listID: "all", month: "all", year: "all" },
    data: {},
  },
  map: {
    data: {},
  },
};

export let firstVisit = true;

// STORAGE

const setLocalStorage = function () {
  localStorage.setItem("state", JSON.stringify(state));
};

const getLocalStorage = function () {
  if (localStorage.state) state = JSON.parse(localStorage.getItem("state"));
};

const getSessionStorage = function () {
  if (sessionStorage.firstVisit) {
    firstVisit = JSON.parse(sessionStorage.getItem("firstVisit"));
  }
};

export const setSessionStorage = function () {
  sessionStorage.setItem("firstVisit", false);
};

// MAP

export const getCoords = async function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

export const getAddress = async function (lat, lon) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
  );
  if (!response.ok)
    throw new Error(
      `Could not get address...response status code from Nominatim: ${response.status}`
    );
  const data = await response.json();
  return data;
};

export const loadTestData = function () {
  const message =
    "Loading test data will overwrite all manual changes. Continue?";
  if (!state.noEntries && !confirm(message)) return false;
  state = testData;
  setLocalStorage();
  return true;
};

export const clearAllData = function () {
  if (confirm("This action will delete all log entries. Continue?")) {
    localStorage.clear();
    return true;
  } else {
    return false;
  }
};

export const loadMapData = function (type, id) {
  let peaks, listID;
  if (type === "list") {
    listID = id;
    peaks = sortPeakList(id).peaks;
  }
  if (type === "log") {
    peaks = getLogEntry(id).peaks;
  }
  const data = {
    peaks: peaks.map((peak) => {
      let logMatch;
      if (state.allLogEntries.length) {
        logMatch = state.allLogEntries.find((entry) =>
          entry.peaks.some((peakObj) => peakObj.id === peak.id)
        );
      }
      return {
        ...peak,
        completed: state.completedPeaks.includes(peak.id) ? true : false,
        completedDate: logMatch
          ? `${logMatch.date.month.numeric}/${logMatch.date.day}/${logMatch.date.year}`
          : false,
      };
    }),
    type,
    id,
  };
  state.map.data = data;
  setLocalStorage();
  // return data;
};

// SIDEBAR

export const updateSidebarState = function () {
  state.sidebarHidden = state.sidebarHidden ? false : true;
  setLocalStorage();
};

// PEAK LIST PREVIEW

export const addSavedList = function (listID) {
  state.savedLists.push(listID);
  setLocalStorage();
};

export const removeSavedList = function (listID) {
  state.savedLists.splice(state.savedLists.indexOf(listID), 1);
  setLocalStorage();
};

export const loadPeakListPreviewData = function () {
  const data = peakListsArr.map((list) => {
    return {
      listID: list.listID,
      title: list.title,
      saved: state.savedLists.includes(list.listID) ? true : false,
      numCompleted: state.listCounts[list.listID],
      peakCount: list.peakCount,
    };
  });
  state.peakPreview.data = data;
  setLocalStorage();
};

export const getListPreviewPage = function (previewType, page) {
  state.peakPreview.page = page || state.peakPreview.page;
  state.peakPreview.previewType = previewType || state.peakPreview.previewType;
  const start = (state.peakPreview.page - 1) * state.peakPreview.resPerPage;
  const end = state.peakPreview.page * state.peakPreview.resPerPage;
  let allData;
  if (state.peakPreview.previewType === "all") allData = state.peakPreview.data;
  if (state.peakPreview.previewType === "saved")
    allData = state.peakPreview.data.filter((list) =>
      state.savedLists.includes(list.listID)
    );
  setLocalStorage();
  return {
    data: allData.slice(start, end),
    previewType: state.peakPreview.previewType,
    page: state.peakPreview.page,
    numPages: Math.ceil(allData.length / state.peakPreview.resPerPage) || 1,
  };
};

// PEAK LIST TABLE

const sortPeakList = function (listID, sortType = "elevation") {
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

export const loadTableData = function (listID, sortType) {
  state.peakTable.sortType = sortType || state.peakTable.sortType;
  const list = sortPeakList(listID, state.peakTable.sortType);
  const data = {
    listID: list.listID,
    title: list.title,
    description: list.description,
    numCompleted: state.listCounts[listID],
    saved: state.savedLists.includes(list.listID) ? true : false,
    peakCount: list.peakCount,
    peaks: list.peaks.map((peak, i) => {
      let logMatch;
      if (state.allLogEntries.length) {
        logMatch = state.allLogEntries.find((entry) =>
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
        completedDate: logMatch
          ? `${logMatch.date.month.numeric}/${logMatch.date.day}/${logMatch.date.year}`
          : false,
      };
    }),
    sortType: state.peakTable.sortType,
  };
  state.peakTable.data = data;
  setLocalStorage();
};

// LOG PREVIEW

const sortLogEntries = function () {
  state.allLogEntries.sort(
    (a, b) => new Date(b.date.fullDate) - new Date(a.date.fullDate)
  );
};

const filterLogEntries = function (listID, month, year) {
  let entries =
    listID === "all"
      ? state.allLogEntries
      : state.allLogEntries.filter((entry) =>
          entry.lists.some((list) => list.listID === listID)
        );
  entries =
    month === "all"
      ? entries
      : entries.filter((entry) => entry.date.month.numeric === month);
  entries =
    year === "all"
      ? entries
      : entries.filter((entry) => entry.date.year === year);
  return entries;
};

export const removeLogEntry = function (logID) {
  const remove = getLogEntry(logID);
  state.allLogEntries.splice(state.allLogEntries.indexOf(remove), 1);
  remove.peaks.forEach((peak) => {
    decreaseListCounts(peak.id);
  });
  if (state.allLogEntries.length === 0) state.noEntries = true;
  setLocalStorage();
};

export const getLogPreviewPage = function (curSelectValues, page = 1) {
  state.logPreview.page = page || state.logPreview.page;
  state.logPreview.curSelectValues =
    curSelectValues || state.logPreview.curSelectValues;
  const { listID, month, year } = state.logPreview.curSelectValues;
  const start = (state.logPreview.page - 1) * state.logPreview.resPerPage;
  const end = state.logPreview.page * state.logPreview.resPerPage;
  state.logPreview.entries = filterLogEntries(listID, month, year);
  return {
    noEntries: state.noEntries,
    entries: state.logPreview.entries.slice(start, end),
    page: state.logPreview.page,
    numPages:
      Math.ceil(
        state.logPreview.entries.length / state.logPreview.resPerPage
      ) || 1,
    allSelectValues: state.allSelectValues,
    curSelectValues: state.logPreview.curSelectValues,
  };
};

// LOG ENTRY

const getLogEntry = function (logID) {
  const entry = state.allLogEntries.find((entry) => entry.logID === logID);
  return entry;
};

export const loadLogEntry = function (logID) {
  const entry = getLogEntry(logID);
  state.curLogEntry = entry;
  setLocalStorage();
};

// STATS

export const getStatsData = function (curSelectValues) {
  state.stats.curSelectValues = curSelectValues || state.stats.curSelectValues;
  const { listID, month, year } = state.stats.curSelectValues;
  const entries = filterLogEntries(listID, month, year);
  const data = {
    numberEntries: entries.length,
    numberPeaks: [
      ...new Set(
        entries.flatMap((entry) => entry.peaks.map((peak) => peak.id))
      ),
    ].length,
    totalDistance:
      Math.round(
        entries
          .map((entry) => entry.stats.distance)
          .reduce((acc, cur) => acc + cur, 0) * 10
      ) / 10,
    totalElevation: Math.round(
      entries
        .map((entry) => entry.stats.elevation)
        .reduce((acc, cur) => acc + cur, 0)
    ),
    totalTime:
      Math.round(
        entries
          .map((entry) => entry.stats.time)
          .reduce((acc, cur) => acc + cur, 0) * 10
      ) / 10,
  };
  state.stats.data = data;
  setLocalStorage();
  return {
    data,
    noEntries: state.noEntries,
    allSelectValues: state.allSelectValues,
    curSelectValues: state.stats.curSelectValues,
  };
};

// NEW ENTRY

const getMatchingLists = function (peakID) {
  // Used for setting log entry and list count data
  const listMatches = [];
  peakListsArr.forEach((peakList) => {
    if (peakList.peaks.some((peak) => peak.id === peakID)) {
      listMatches.push(peakList);
    }
  });
  return listMatches;
};

const setLogEntryID = function () {
  const logID = state.allLogEntries.length
    ? Math.max(...state.allLogEntries.map((entry) => entry.logID)) + 1
    : 1;
  return logID;
};

const setLogEntryLists = function (peakIDs) {
  let allLists = [];
  peakIDs.forEach((peakID) => {
    increaseListCounts(peakID);
    const listMatches = getMatchingLists(peakID);
    listMatches.forEach((list) => {
      const listObj = {
        listID: list.listID,
        title: list.title,
      };
      if (!allLists.some((obj) => obj.listID === listObj.listID)) {
        allLists.push(listObj);
      }
    });
  });
  allLists.sort((a, b) =>
    a.title.toLowerCase().localeCompare(b.title.toLowerCase())
  );
  return allLists;
};

const increaseListCounts = function (peakID) {
  const listMatches = getMatchingLists(peakID);
  if (!state.completedPeaks.includes(peakID)) {
    state.completedPeaks.push(peakID);
    listMatches.forEach((list) => {
      state.listCounts[list.listID] += 1;
    });
  }
};

const decreaseListCounts = function (peakID) {
  if (
    !state.allLogEntries
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

export const getCheckboxData = function (listID, checkedID) {
  setLocalStorage();
  return {
    listID,
    checkedID: +checkedID || false,
    peaks: sortPeakList(listID, "alphabetical").peaks,
  };
};

export const addLogEntry = function (formData) {
  if (!formData.date) {
    alert("Please enter a complete date in the format MM-DD-YYY");
    return false;
  }
  if (
    +formData.date.slice(0, 4) < 1900 ||
    new Date(formData.date).getTime() > new Date().getTime()
  ) {
    alert(`Please enter a date between 01-01-1900 and today`);
    return false;
  }
  if (!formData.peakIDs) {
    alert("Please choose at least one peak from a list");
    return false;
  }
  const logID = setLogEntryID();
  const lists = setLogEntryLists(formData.peakIDs);
  const entry = new LogEntry(formData, logID, lists);
  state.noEntries = false;
  state.allLogEntries.unshift(entry);
  state.curLogEntry = entry;
  sortLogEntries();
  updateAllSelectValues();
  setLocalStorage();
  return true;
};

// SELECTS

const updateAllSelectValues = function () {
  const years = [
    ...new Set(state.allLogEntries.map((entry) => entry.date.year)),
  ].sort((a, b) => b - a);

  const allLists = state.allLogEntries.flatMap((entry) => entry.lists);
  const lists = [...new Set(allLists.map(JSON.stringify))].map(JSON.parse);
  lists.sort((a, b) =>
    a.title.toLowerCase().localeCompare(b.title.toLowerCase())
  );
  const allMonths = state.allLogEntries.flatMap((entry) => entry.date.month);
  const months = [...new Set(allMonths.map(JSON.stringify))].map(JSON.parse);
  months.sort((a, b) => a.numeric - b.numeric);
  const allSelectValues = {
    lists,
    months,
    years,
  };
  state.allSelectValues = allSelectValues;
  setLocalStorage();
};

export const getListSelectData = function () {
  return peakListsArr.map((list) => {
    return {
      listID: list.listID,
      title: list.title,
    };
  });
};

// INIT

const initializeListCounts = function () {
  peakListsArr.forEach((list) => {
    if (!state.listCounts[`${list.listID}`])
      state.listCounts[`${list.listID}`] = 0;
  });
};

const init = function () {
  getLocalStorage();
  initializeListCounts();
  updateAllSelectValues();
  setLocalStorage();
  getSessionStorage();
};

init();
