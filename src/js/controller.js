import * as model from "./model.js";
import logPreviewView from "./views/logPreviewView.js";
import logEntryView from "./views/logEntryView.js";
import newEntryView from "./views/newEntryView.js";
import mainView from "./views/mainView.js";
import mapView from "./views/mapView.js";
import modalView from "./views/modalView.js";
import peakListPreviewView from "./views/peakListPreviewView.js";
import peakListTableView from "./views/peakListTableView.js";
import statsView from "./views/statsView.js";

/////////////////////////////////////////////////////////////////////////////////
// MAIN VIEW

const controlBtnBack = function (containerID) {
  mainView.showContainer(containerID);
  if (containerID === "peak-list-preview") {
    peakListPreviewView.render(model.getPreviewData());
  }
  if (containerID === "log-preview") {
    logPreviewView.render(model.getLogEntries());
  }
  mapView.clearMap();
};

const controlHideContainer = function () {
  mainView.hideContainer();
  newEntryView.clearForm();
  mapView.clearMap();
  window.history.pushState(null, "", `/map`);
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
    logPreviewView.render(model.getLogEntries());
  }
  if (containerID === "peak-list-preview") {
    peakListPreviewView.render(model.getPreviewData());
  }
  if (containerID === "peak-list-table") {
    peakListTableView.render(model.getTableData());
    mapView.plotPeaksOnMap(model.getMapData("list"));
  }
  if (containerID === "stats") {
    statsView.render();
  }
};

const controlLoadData = function () {
  model.loadTestData();
  logPreviewView.render(model.getLogEntries());
  mainView.showContainer("log-preview");
};

const controlClearAllData = function () {
  model.clearAllData();
  location.reload();
};

const controlOpenModal = function () {
  modalView.openModal();
};

const controlFirstVisit = function () {
  !model.visitedThisSession && modalView.openModal();
  model.setSessionStorage();
};

const controlSidebar = function () {
  model.updateSidebarHidden();
  mainView.toggleSidebar(model.state.sidebarHidden);
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
  peakListPreviewView.render(model.getPreviewData(previewType));
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
  peakListTableView.render(model.getTableData(listID, sortType));
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

const controlLogSelects = function (selectValues) {
  logPreviewView.render(model.getLogEntries(selectValues));
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
  logPreviewView.updateYearSelect(model.getLogYears());
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
  modalView.addHandlerLoadData(controlLoadData);
  mainView.addHandlerLoadPage(controlMainNav);
  mainView.addHandlerHideContainer(controlHideContainer);
  mainView.addHandlerMainNav(controlMainNav);
  mainView.addHandlerBtnBack(controlBtnBack);
  mainView.addHandlerLoadData(controlLoadData);
  mainView.addHandlerClearAllData(controlClearAllData);
  mainView.addHandlerBtnAbout(controlOpenModal);
  mainView.addHandlerSidebar(controlSidebar);
  mainView.toggleSidebar(model.state.sidebarHidden);
  peakListPreviewView.addHandlerViewTable(controlShowTable);
  peakListPreviewView.addHandlerSavedLists(controlSavedListsPreview);
  peakListPreviewView.addHandlerPreviewType(controlPeakListPreview);
  peakListTableView.addHandlerSortTable(controlTableSort);
  peakListTableView.addHandlerRowHover(controlTableRowHover);
  peakListTableView.addHandlerSavedLists(controlSavedListsTable);
  peakListTableView.addHandlerLogTrip(controlLogTrip);
  logPreviewView.initializeListSelect(model.getListSelectData());
  logPreviewView.updateYearSelect(model.getLogYears());
  logPreviewView.addHandlerShowEntry(controlShowLogEntry);
  logPreviewView.addHandlerDeleteEntry(controlDeleteLogEntry);
  logPreviewView.addHandlerAddEntry(controlLogAddEntry);
  logPreviewView.addHandlerLogSelects(controlLogSelects);
  logEntryView.addHandlerDeleteEntry(controlDeleteLogEntry);
  logEntryView.addHandlerViewMap(controlLogListView);
  newEntryView.initializeListSelect(model.getListSelectData());
  newEntryView.addHandlerDate(controlNewEntryDate);
  newEntryView.addHandlerPeakListSelect(controlPeakListSelect);
  newEntryView.addHandlerAddEntry(controlFormAddEntry);
  newEntryView.addHandlerClearForm(controlClearForm);
  controlFirstVisit();
};

init();
