import * as model from "./model.js";
import historyView from "./views/historyView.js";
import newEntryView from "./views/newEntryView.js";
import mainView from "./views/mainView.js";
import mapView from "./views/mapView.js";
import peakListView from "./views/peakListView.js";

/////////////////////////////////////////////////////////////////////////////////
// MAIN VIEW

const controlBtnBack = function (containerID) {
  mainView.displayContainer(containerID);
  mapView.clearMap();
};

const controlCloseContainer = function () {
  mainView.closeMainContainer();
  newEntryView.clearNewEntryForm();
  mapView.clearMap();
};

const controlMainNavClick = function (containerID) {
  mapView.clearMap();
  if (containerID === "map") {
    mainView.closeMainContainer();
    return;
  }
  mainView.displayContainer(containerID);
  if (containerID === "all-history") {
    historyView.displayAllHistoryList(model.state.logEntries);
  }
  if (containerID === "all-peak-lists") {
    peakListView.displayPeakListsPreview(
      model.getPeakListsArr(model.state.currentListView),
      model.state.currentListView,
      model.state.savedLists,
      model.state.listCounts
    );
  }
};

/////////////////////////////////////////////////////////////////////////////////
// MAP

const initializeMap = async function () {
  try {
    const pos = await model.getCoords();
    const { latitude, longitude } = pos.coords;
    mapView.loadMap([latitude, longitude]);
  } catch {
    mapView.loadMap();
  }
};

/////////////////////////////////////////////////////////////////////////////////
// PEAK LISTS

const controlSinglePeakListView = function (listID) {
  mainView.displayContainer("single-peak-list");
  model.sortPeakList(listID, "elevation");
  peakListView.displaySinglePeakList(
    model.getPeakList(listID),
    model.state.listCounts,
    model.state.logEntries
  );
  mapView.plotListOnMap(model.getPeakList(listID), model.state.completedPeaks);
};

const controlPeakListPreview = function (type) {
  model.state.currentListView = type;
  peakListView.displayPeakListsPreview(
    model.getPeakListsArr(model.state.currentListView),
    model.state.currentListView,
    model.state.savedLists,
    model.state.listCounts
  );
};

const controlLogTrip = function (listID, mtnID) {
  mainView.displayContainer("new-entry");
  newEntryView.displayCheckboxes(
    model.getCheckboxDisplayArr(listID),
    listID,
    mtnID
  );
  mapView.plotListOnMap(model.getPeakList(listID), model.state.completedPeaks);
};

const controlSavedLists = function (listID) {
  if (!model.state.savedLists.includes(listID)) {
    model.addSavedList(listID);
  } else {
    model.removeSavedList(listID);
  }
  peakListView.displayPeakListsPreview(
    model.getPeakListsArr(model.state.currentListView),
    model.state.currentListView,
    model.state.savedLists,
    model.state.listCounts
  );
};

/////////////////////////////////////////////////////////////////////////////////
// HISTORY

const controlSingleHistoryView = function (logID) {
  mainView.displayContainer("single-history");
  historyView.displaySingleHistory(model.getLogEntry(logID));
};

const controlRemoveSingleHistory = function (logID) {
  model.removeLogEntry(logID);
  historyView.displayAllHistoryList(model.state.logEntries);
};

/////////////////////////////////////////////////////////////////////////////////
// NEW ENTRY

const controlAddEntry = function (data, listID) {
  model.addLogEntry(data);
  mapView.plotListOnMap(model.getPeakList(listID), model.state.completedPeaks);
};

const controlNewEntryDate = function (date) {
  newEntryView.changeDate(model.getDate(date));
};

const controlPeakListSelect = function (listID) {
  newEntryView.displayCheckboxes(model.getCheckboxDisplayArr(listID));
  mapView.plotListOnMap(model.getPeakList(listID), model.state.completedPeaks);
};

const init = function () {
  newEntryView.addHandlerDateClick(controlNewEntryDate);
  newEntryView.addHandlerChangeListSelect(controlPeakListSelect);
  newEntryView.addHandlerAddEntry(controlAddEntry);
  mainView.addHandlerCloseMainContainer(controlCloseContainer);
  mainView.addHandlerMainNavClick(controlMainNavClick);
  mainView.addHandlerBtnBack(controlBtnBack);
  peakListView.addPeakListViewHandler(controlSinglePeakListView);
  peakListView.addHandlerLogTrip(controlLogTrip);
  peakListView.addHandlerSaveList(controlSavedLists);
  peakListView.addHandlerBtnsWrapper(controlPeakListPreview);
  historyView.addHandlerViewSingleHistory(controlSingleHistoryView);
  historyView.addHandlerRemoveHistoryEntry(controlRemoveSingleHistory);
  initializeMap();
};

init();
