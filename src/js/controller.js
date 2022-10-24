import * as model from "./model.js";
import logPreviewView from "./views/logPreviewView.js";
import logEntryView from "./views/logEntryView.js";
import newEntryView from "./views/newEntryView.js";
import mainView from "./views/mainView.js";
import mapView from "./views/mapView.js";
import peakListPreviewView from "./views/peakListPreviewView.js";
import peakListTableView from "./views/peakListTableView.js";

/////////////////////////////////////////////////////////////////////////////////
// MAIN VIEW

const controlBtnBack = function (containerID) {
  mainView.showContainer(containerID);
  if (containerID === "peak-list-preview") {
    peakListPreviewView.render(model.getPreviewData());
  }
  if (containerID === "log-preview") {
    logPreviewView.render(model.getLogEntries(model.state.currentLogSelect));
  }
  mapView.clearMap();
};

const controlHideContainer = function () {
  mainView.hideContainer();
  newEntryView.clearForm();
  mapView.clearMap();
};

const controlMainNav = function (containerID) {
  mapView.clearMap();
  newEntryView.clearForm();
  if (containerID === "map") {
    mainView.hideContainer();
    return;
  }
  mainView.showContainer(containerID);
  if (containerID === "log-preview") {
    logPreviewView.render(model.getLogEntries(model.state.currentLogSelect));
  }
  if (containerID === "peak-list-preview") {
    peakListPreviewView.render(model.getPreviewData());
  }
};

const controlLoadData = function () {
  model.loadTestData();
};

const controlClearAllData = function () {
  model.clearAllData();
};

/////////////////////////////////////////////////////////////////////////////////
// MAP

const controlLocation = async function () {
  try {
    const pos = await model.getCoords();
    const { latitude, longitude } = pos.coords;
    mapView.setMapView([latitude, longitude]);
  } catch {
    alert("Could not get your location");
  }
};

/////////////////////////////////////////////////////////////////////////////////
// PEAK LISTS

const controlShowTable = function (listID) {
  mainView.showContainer("peak-list-table");
  peakListTableView.render(model.getTableData(listID));
  mapView.plotPeaksOnMap(model.getMapData("list", listID));
};

const controlPeakListPreview = function (previewType) {
  model.setCurrentPreviewView(previewType);
  peakListPreviewView.render(model.getPreviewData());
};

const controlLogTrip = function (listID, checkedID) {
  mainView.showContainer("new-entry");
  newEntryView.displayCheckboxes(model.getCheckboxData(listID, checkedID));
  mapView.plotPeaksOnMap(model.getMapData("list", listID));
};

const controlSavedListsPreview = function (listID) {
  if (!model.state.savedLists.includes(listID)) {
    model.addSavedList(listID);
  } else {
    model.removeSavedList(listID);
  }
  peakListPreviewView.render(model.getPreviewData());
};

const controlSavedListsTable = function (listID) {
  if (!model.state.savedLists.includes(listID)) {
    model.addSavedList(listID);
  } else {
    model.removeSavedList(listID);
  }
  peakListTableView.render(model.getTableData(listID));
};

const controlTableRowHover = function (peakID) {
  mapView.openPopup(peakID);
};

const controlTableSort = function (listID, sortType) {
  model.setCurrentTableSort(sortType);
  peakListTableView.render(model.getTableData(listID));
};

/////////////////////////////////////////////////////////////////////////////////
// TRIP LOG

const controlShowLogEntry = function (logID) {
  mainView.showContainer("log-entry");
  logEntryView.render(model.getLogEntry(logID));
  mapView.plotPeaksOnMap(model.getMapData("log", logID));
};

const controlDeleteLogEntry = function (logID) {
  model.removeLogEntry(logID);
  mainView.showContainer("log-preview");
  mapView.clearMap();
  logPreviewView.render(model.getLogEntries());
};

const controlLogAddEntry = function () {
  mainView.showContainer("new-entry");
};

const controlLogSelect = function (listID) {
  model.setCurrentLogSelect(listID);
  logPreviewView.render(model.getLogEntries());
};

const controlLogListView = function (type, id) {
  mapView.plotPeaksOnMap(model.getMapData(type, id));
};

/////////////////////////////////////////////////////////////////////////////////
// NEW ENTRY

const controlClearForm = function () {
  newEntryView.clearForm();
  mapView.clearMap();
};

const controlFormAddEntry = function (formData) {
  const logID = model.addLogEntry(formData);
  mainView.showContainer("log-entry");
  logEntryView.render(model.getLogEntry(logID));
  mapView.plotPeaksOnMap(model.getMapData("log", logID));
};

const controlNewEntryDate = function (date) {
  newEntryView.changeDate(model.getDate(date));
};

const controlPeakListSelect = function (listID) {
  newEntryView.displayCheckboxes(model.getCheckboxData(listID));
  mapView.plotPeaksOnMap(model.getMapData("list", listID));
};

const init = function () {
  mapView.loadMap();
  mapView.addHandlerGetLocation(controlLocation);
  newEntryView.initializeListSelect(model.getSelectData());
  newEntryView.addHandlerDate(controlNewEntryDate);
  newEntryView.addHandlerPeakListSelect(controlPeakListSelect);
  newEntryView.addHandlerAddEntry(controlFormAddEntry);
  newEntryView.addHandlerClearForm(controlClearForm);
  mainView.addHandlerHideContainer(controlHideContainer);
  mainView.addHandlerMainNav(controlMainNav);
  mainView.addHandlerBtnBack(controlBtnBack);
  mainView.addHandlerLoadData(controlLoadData);
  mainView.addHandlerClearAllData(controlClearAllData);
  peakListPreviewView.addHandlerViewTable(controlShowTable);
  peakListPreviewView.addHandlerSavedLists(controlSavedListsPreview);
  peakListPreviewView.addHandlerPreviewType(controlPeakListPreview);
  peakListTableView.addHandlerSortTable(controlTableSort);
  peakListTableView.addHandlerRowHover(controlTableRowHover);
  peakListTableView.addHandlerSavedLists(controlSavedListsTable);
  peakListTableView.addHandlerLogTrip(controlLogTrip);
  logPreviewView.initializeListSelect(model.getSelectData());
  logPreviewView.addHandlerShowEntry(controlShowLogEntry);
  logPreviewView.addHandlerDeleteEntry(controlDeleteLogEntry);
  logPreviewView.addHandlerAddEntry(controlLogAddEntry);
  logPreviewView.addHandlerLogSelect(controlLogSelect);
  logEntryView.addHandlerDeleteEntry(controlDeleteLogEntry);
  logEntryView.addHandlerViewMap(controlLogListView);
};

init();
