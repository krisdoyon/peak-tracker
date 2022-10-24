import * as model from "./model.js";
import logView from "./views/logView.js";
import newEntryView from "./views/newEntryView.js";
import mainView from "./views/mainView.js";
import mapView from "./views/mapView.js";
import peakListView from "./views/peakListView.js";

/////////////////////////////////////////////////////////////////////////////////
// MAIN VIEW

const controlBtnBack = function (containerID) {
  mainView.showContainer(containerID);
  if (containerID === "all-peak-lists") {
    peakListView.renderPeakListsPreview(model.getPreviewData());
  }
  if (containerID === "log-preview") {
    logView.renderLogPreview(model.getLogEntries(model.state.currentLogSelect));
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
    logView.renderLogPreview(model.getLogEntries(model.state.currentLogSelect));
  }
  if (containerID === "all-peak-lists") {
    peakListView.renderPeakListsPreview(model.getPreviewData());
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

const controlPeakListTable = function (listID) {
  mainView.showContainer("single-peak-list");
  peakListView.renderPeakListTable(model.getTableData(listID));
  mapView.plotPeaksOnMap(model.getMapData("list", listID));
};

const controlPeakListPreview = function (previewType) {
  model.setCurrentPreviewView(previewType);
  peakListView.renderPeakListsPreview(model.getPreviewData());
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
  peakListView.renderPeakListsPreview(model.getPreviewData());
};

const controlSavedListsTable = function (listID) {
  if (!model.state.savedLists.includes(listID)) {
    model.addSavedList(listID);
  } else {
    model.removeSavedList(listID);
  }
  peakListView.renderPeakListTable(model.getTableData(listID));
};

const controlTableHover = function (peakID) {
  mapView.openPopup(peakID);
};

const controlSortTable = function (listID, sortType) {
  model.setCurrentTableSort(sortType);
  peakListView.renderPeakListTable(model.getTableData(listID));
};

/////////////////////////////////////////////////////////////////////////////////
// TRIP LOG

const controlShowLogEntry = function (logID) {
  mainView.showContainer("log-entry");
  logView.renderLogEntry(model.getLogEntry(logID));
  mapView.plotPeaksOnMap(model.getMapData("log", logID));
};

const controlDeleteLogEntry = function (logID) {
  model.removeLogEntry(logID);
  mainView.showContainer("log-preview");
  mapView.clearMap();
  logView.renderLogPreview(model.getLogEntries());
};

const controlLogAddEntry = function () {
  mainView.showContainer("new-entry");
};

const controlLogSelect = function (listID) {
  model.setCurrentLogSelect(listID);
  logView.renderLogPreview(model.getLogEntries());
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
  logView.renderLogEntry(model.getLogEntry(logID));
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
  peakListView.addHandlerPeakListView(controlPeakListTable);
  peakListView.addHandlerLogTrip(controlLogTrip);
  peakListView.addHandlerSavedListsPreview(controlSavedListsPreview);
  peakListView.addHandlerSavedListsTable(controlSavedListsTable);
  peakListView.addHandlerPeakListPreview(controlPeakListPreview);
  peakListView.addHandlerSortTable(controlSortTable);
  peakListView.addHandlerTableRowHover(controlTableHover);
  logView.initializeListSelect(model.getSelectData());
  logView.addHandlerShowEntry(controlShowLogEntry);
  logView.addHandlerDeleteEntryPreview(controlDeleteLogEntry);
  logView.addHandlerDeleteEntry(controlDeleteLogEntry);
  logView.addHandlerAddEntry(controlLogAddEntry);
  logView.addHandlerLogSelect(controlLogSelect);
  logView.addHandlerView(controlLogListView);
};

init();
