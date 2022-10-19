import * as model from "./model.js";
import historyView from "./views/historyView.js";
import newEntryView from "./views/newEntryView.js";
import mainView from "./views/mainView.js";
import mapView from "./views/mapView.js";
import peakListView from "./views/peakListView.js";

/////////////////////////////////////////////////////////////////////////////////
// MAIN VIEW

const controlBtnBack = function (containerID) {
  mainView.showContainer(containerID);
  mapView.clearMap();
};

const controlHideContainer = function () {
  mainView.hideContainer();
  newEntryView.clearNewEntryForm();
  mapView.clearMap();
};

const controlMainNav = function (containerID) {
  mapView.clearMap();
  newEntryView.clearNewEntryForm();
  if (containerID === "map") {
    mainView.hideContainer();
    return;
  }
  mainView.showContainer(containerID);
  if (containerID === "all-history") {
    historyView.renderAllHistory(model.state.logEntries);
  }
  if (containerID === "all-peak-lists") {
    peakListView.renderPeakListsPreview(model.getPreviewData());
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

const controlPeakListTable = function (listID) {
  mainView.showContainer("single-peak-list");
  model.sortPeakList(listID, "elevation");
  peakListView.renderPeakListTable(model.getTableData(listID));
  mapView.plotListOnMap(model.getPeakList(listID), model.state.completedPeaks);
};

const controlPeakListPreview = function (type) {
  model.setCurrentListView(type);
  peakListView.renderPeakListsPreview(model.getPreviewData());
};

const controlLogTrip = function (listID, mtnID) {
  mainView.showContainer("new-entry");
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
  peakListView.renderPeakListsPreview(model.getPreviewData());
};

/////////////////////////////////////////////////////////////////////////////////
// HISTORY

const controlShowHistoryEntry = function (logID, listID) {
  mainView.showContainer("single-history");
  historyView.renderHistoryEntry(model.getLogEntry(logID));
  mapView.plotListOnMap(model.getPeakList(listID), model.state.completedPeaks);
};

const controlDeleteHistoryEntry = function (logID) {
  model.removeLogEntry(logID);
  historyView.renderAllHistory(model.state.logEntries);
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
  initializeMap();
  newEntryView.addHandlerDate(controlNewEntryDate);
  newEntryView.addHandlerPeakListSelect(controlPeakListSelect);
  newEntryView.addHandlerAddEntry(controlAddEntry);
  mainView.addHandlerHideContainer(controlHideContainer);
  mainView.addHandlerMainNav(controlMainNav);
  mainView.addHandlerBtnBack(controlBtnBack);
  peakListView.addHandlerPeakListView(controlPeakListTable);
  peakListView.addHandlerLogTrip(controlLogTrip);
  peakListView.addHandlerSavedLists(controlSavedLists);
  peakListView.addHandlerPeakListPreview(controlPeakListPreview);
  historyView.addHandlerShowEntry(controlShowHistoryEntry);
  historyView.addHandlerDeleteEntry(controlDeleteHistoryEntry);
};

init();
