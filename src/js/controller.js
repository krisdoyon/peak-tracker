import * as model from "./model.js";
import logPreviewView from "./views/logPreviewView.js";
import logEntryView from "./views/logEntryView.js";
import newEntryView from "./views/newEntryView.js";
import mainView from "./views/mainView.js";
import mapView from "./views/mapView.js";
import modalView from "./views/modalView.js";
import peakListPreviewView from "./views/peakListPreviewView.js";
import peakListTableView from "./views/peakListTableView.js";
import sidebarView from "./views/sidebarView.js";
import statsView from "./views/statsView.js";

/////////////////////////////////////////////////////////////////////////////////
// MAIN VIEW

const controlPageLoad = function () {
  window.location.hash.slice(1) ||
    this.window.history.pushState(null, "", "#map");
  const hash = window.location.hash.slice(1);
  hash === "map" && controlMap();
  hash === "peak-list-preview" && controlPeakListPreview();
  hash === "peak-list-table" && controlPeakListTable();
  hash === "log-preview" && controlLogPreview();
  hash === "log-entry" && controlLogEntry();
  hash === "stats" && controlStats();
  hash === "new-entry" && controlNewEntry();
};

const controlGoBack = function (containerID) {
  if (containerID === "peak-list-preview") {
    window.history.pushState(null, "", "#peak-list-preview");
    controlPeakListPreview();
  }
  if (containerID === "log-preview") {
    window.history.pushState(null, "", "#log-preview");
    controlLogPreview();
  }
};

const controlCloseContainer = function () {
  if (controlClearForm()) {
    window.history.pushState(null, "", "#map");
    mainView.closeContainer();
  }
};

// SIDEBAR

const controlSidebar = function () {
  model.updateSidebarState();
  sidebarView.toggleSidebar(model.state.sidebarHidden);
};

// MODAL

const controlLoadTestData = function () {
  if (model.loadTestData()) {
    window.history.pushState(null, "", "#log-preview");
    controlLogPreview();
    location.reload();
  }
};

const controlClearAllData = function () {
  if (model.clearAllData()) {
    window.history.pushState(null, "", "#log-preview");
    controlLogPreview();
    location.reload();
  }
};

// const controlOpenModal = function () {
//   modalView.openModal();
// };

const controlFirstVisit = function () {
  model.firstVisit && modalView.openModal();
  model.setSessionStorage();
};

/////////////////////////////////////////////////////////////////////////////////
// MAP

const controlMap = function () {
  if (controlClearForm()) {
    mainView.closeContainer();
  }
};

const controlLocation = async function () {
  let latitude, longitude;
  try {
    const pos = await model.getCoords();
    latitude = pos.coords.latitude;
    longitude = pos.coords.longitude;
    mapView.setMapView([latitude, longitude]);
  } catch (err) {
    alert(
      "Could not get your location. You must have location services enabled to use this feature."
    );
    console.error(err);
    return;
  }
  try {
    const res = await model.getAddress(latitude, longitude);
    const address = res.display_name;
    mapView.addLocationPopup(address);
  } catch (err) {
    console.error(err);
  }
};

/////////////////////////////////////////////////////////////////////////////////
// PEAK LIST PREVIEW

const controlPeakListPreview = function (
  previewType = model.state.peakPreview.previewType,
  page = 1
) {
  if (controlClearForm()) {
    model.loadPeakListPreviewData();
    peakListPreviewView.render(model.getListPreviewPage(previewType, page));
    peakListPreviewView.showContainer();
  }
};

const controlLogTrip = function (listID, checkedID) {
  model.loadMapData("list", listID);
  newEntryView.displayCheckboxes(model.getCheckboxData(listID, checkedID));
  mapView.plotPeaksOnMap(model.state.map);
  newEntryView.showContainer();
};

const controlSavedListsPreview = function (listID) {
  !model.state.savedLists.includes(listID)
    ? model.addSavedList(listID)
    : model.removeSavedList(listID);
  model.loadPeakListPreviewData();
  peakListPreviewView.render(model.getListPreviewPage());
};

/////////////////////////////////////////////////////////////////////////////////
// PEAK LIST TABLE

const controlPeakListTable = function (
  listID = model.state.peakTable.data.listID
) {
  window.history.pushState(null, "", "#peak-list-table");
  model.loadTableData(listID);
  model.loadMapData("list", listID);
  peakListTableView.render(model.state.peakTable);
  mapView.plotPeaksOnMap(model.state.map);
  peakListTableView.showContainer();
};

const controlSavedListsTable = function (listID) {
  !model.state.savedLists.includes(listID)
    ? model.addSavedList(listID)
    : model.removeSavedList(listID);
  model.loadTableData(listID);
  peakListTableView.render(model.state.peakTable);
};

const controlTableRowHover = function (peakID) {
  mapView.openPopup(peakID);
};

const controlTableSort = function (listID, sortType) {
  model.loadTableData(listID, sortType);
  peakListTableView.render(model.state.peakTable);
};

/////////////////////////////////////////////////////////////////////////////////
// LOG PREVIEW

const controlLogPreview = function (
  curSelectValues = model.state.logPreview.curSelectValues,
  page = 1
) {
  if (controlClearForm()) {
    logPreviewView.render(model.getLogPreviewPage(curSelectValues, page));
    logPreviewView.showContainer();
  }
};

const controlDeleteLogEntry = function (logID) {
  model.removeLogEntry(logID);
  mapView.clearMap();
  logPreviewView.render(model.getLogPreviewPage());
  logPreviewView.showContainer();
};

const controlLogSelects = function (curSelectValues, page = 1) {
  logPreviewView.render(model.getLogPreviewPage(curSelectValues, page));
};

/////////////////////////////////////////////////////////////////////////////////
// LOG ENTRY

const controlLogEntry = function (logID = model.state.curLogEntry.logID) {
  window.history.pushState(null, "", "#log-entry");
  model.loadLogEntry(logID);
  model.loadMapData("log", logID);
  logEntryView.render(model.state.curLogEntry);
  mapView.plotPeaksOnMap(model.state.map);
  logEntryView.showContainer();
};

const controlLogViewBtns = function (type, id) {
  model.loadMapData(type, id);
  mapView.plotPeaksOnMap(model.state.map);
};

/////////////////////////////////////////////////////////////////////////////////
// STATS

const controlStats = function () {
  if (controlClearForm()) {
    statsView.render(model.getStatsData());
    statsView.showContainer();
  }
};

const controlStatsSelects = function (selectValues) {
  statsView.render(model.getStatsData(selectValues));
};

/////////////////////////////////////////////////////////////////////////////////
// NEW ENTRY

const controlNewEntry = function () {
  newEntryView.showContainer();
};

const controlClearForm = function () {
  const message =
    "You have unsaved changes that will be discarded by this action. Do you want to continue?";
  if (!newEntryView.isFormEmpty() && !confirm(message)) return false;
  newEntryView.clearForm();
  mapView.clearMap();
  return true;
};

const controlFormAddEntry = function (formData) {
  if (model.addLogEntry(formData)) {
    newEntryView.clearForm();
    model.loadMapData("log", model.state.curLogEntry.logID);
    mapView.plotPeaksOnMap(model.state.map);
    logEntryView.render(model.state.curLogEntry);
    logEntryView.showContainer();
  }
};

const controlNewEntryDate = function (date) {
  newEntryView.changeDate(model.getDate(date));
};

const controlFormSelect = function (listID) {
  model.loadMapData("list", listID);
  newEntryView.displayCheckboxes(model.getCheckboxData(listID));
  mapView.plotPeaksOnMap(model.state.map);
};

/////////////////////////////////////////////////////////////////////////////////
// INIT

const init = function () {
  controlFirstVisit();
  // MAP
  mapView.loadMap();
  mapView.addHandlerNavClick(controlMap);
  mapView.addHandlerGetLocation(controlLocation);
  mapView.addHandlerLoadData(controlLoadTestData);
  mapView.addHandlerClearAllData(controlClearAllData);
  // MODAL
  modalView.addHandlerLoadData(controlLoadTestData);
  // MAIN
  mainView.addHandlerCloseContainer(controlCloseContainer);
  mainView.addHandlerBtnBack(controlGoBack);
  mainView.addHandlerPageLoad(controlPageLoad);
  // SIDEBAR
  // sidebarView.addHandlerBtnAbout(controlOpenModal);
  sidebarView.addHandlerSidebar(controlSidebar);
  sidebarView.toggleSidebar(model.state.sidebarHidden);
  // PEAK LIST PREVIEW
  peakListPreviewView.addHandlerViewTable(controlPeakListTable);
  peakListPreviewView.addHandlerSavedLists(controlSavedListsPreview);
  peakListPreviewView.addHandlerPreviewType(controlPeakListPreview);
  peakListPreviewView.addHandlerPagination(controlPeakListPreview);
  peakListPreviewView.addHandlerNavClick(controlPeakListPreview);
  // PEAK LIST TABLE
  peakListTableView.addHandlerSortTable(controlTableSort);
  peakListTableView.addHandlerRowHover(controlTableRowHover);
  peakListTableView.addHandlerSavedLists(controlSavedListsTable);
  peakListTableView.addHandlerLogTrip(controlLogTrip);
  // LOG PREVIEW
  logPreviewView.addHandlerNavClick(controlLogPreview);
  logPreviewView.addHandlerShowEntry(controlLogEntry);
  logPreviewView.addHandlerDeleteEntry(controlDeleteLogEntry);
  logPreviewView.addHandlerAddEntry(controlNewEntry);
  logPreviewView.addHandlerLogSelects(controlLogSelects);
  logPreviewView.addHandlerPagination(controlLogPreview);
  // LOG ENTRY
  logEntryView.addHandlerDeleteEntry(controlDeleteLogEntry);
  logEntryView.addHandlerViewMap(controlLogViewBtns);
  // NEW ENTRY
  newEntryView.initializeListSelect(model.getListSelectData());
  newEntryView.addHandlerNavClick(controlNewEntry);
  newEntryView.addHandlerDate(controlNewEntryDate);
  newEntryView.addHandlerPeakListSelect(controlFormSelect);
  newEntryView.addHandlerAddEntry(controlFormAddEntry);
  newEntryView.addHandlerClearForm(controlClearForm);
  // STATS
  statsView.addHandlerLogSelects(controlStatsSelects);
  statsView.addHandlerAddEntry(controlNewEntry);
  statsView.addHandlerNavClick(controlStats);
};

init();
