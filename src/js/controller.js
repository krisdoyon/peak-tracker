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
    logView.renderLogPreview(model.state.logEntries);
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
  peakListView.renderPeakListTable(model.getTableData(listID));
  mapView.plotListOnMap(model.getMapData(listID));
};

const controlPeakListPreview = function (previewType) {
  model.setCurrentPreviewView(previewType);
  peakListView.renderPeakListsPreview(model.getPreviewData());
};

const controlLogTrip = function (listID, mtnID) {
  mainView.showContainer("new-entry");
  newEntryView.displayCheckboxes(
    model.getCheckboxDisplayArr(listID),
    listID,
    mtnID
  );
  mapView.plotListOnMap(model.getMapData(listID));
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
// TRIP LOG

const controlShowLogEntry = function (logID, listID) {
  mainView.showContainer("log-entry");
  logView.renderLogEntry(model.getLogEntry(logID));
  mapView.plotListOnMap(model.getMapData(listID));
};

const controlDeleteLogEntry = function (logID) {
  model.removeLogEntry(logID);
  logView.renderLogPreview(model.state.logEntries);
};

const controlLogAddEntry = function () {
  mainView.showContainer("new-entry");
};

/////////////////////////////////////////////////////////////////////////////////
// NEW ENTRY

const controlClearForm = function () {
  newEntryView.clearForm();
  mapView.clearMap();
};

const controlFormAddEntry = function (formData, listID) {
  model.addLogEntry(formData);
  newEntryView.clearForm();
  mapView.plotListOnMap(model.getMapData(listID));
};

const controlNewEntryDate = function (date) {
  newEntryView.changeDate(model.getDate(date));
};

const controlPeakListSelect = function (listID) {
  newEntryView.displayCheckboxes(model.getCheckboxDisplayArr(listID));
  mapView.plotListOnMap(model.getMapData(listID));
};

const init = function () {
  initializeMap();
  newEntryView.initializeListSelect(model.getSelectData());
  newEntryView.addHandlerDate(controlNewEntryDate);
  newEntryView.addHandlerPeakListSelect(controlPeakListSelect);
  newEntryView.addHandlerAddEntry(controlFormAddEntry);
  newEntryView.addHandlerClearForm(controlClearForm);
  mainView.addHandlerHideContainer(controlHideContainer);
  mainView.addHandlerMainNav(controlMainNav);
  mainView.addHandlerBtnBack(controlBtnBack);
  peakListView.addHandlerPeakListView(controlPeakListTable);
  peakListView.addHandlerLogTrip(controlLogTrip);
  peakListView.addHandlerSavedLists(controlSavedLists);
  peakListView.addHandlerPeakListPreview(controlPeakListPreview);
  logView.addHandlerShowEntry(controlShowLogEntry);
  logView.addHandlerDeleteEntry(controlDeleteLogEntry);
  logView.addHandlerAddEntry(controlLogAddEntry);
};

init();
