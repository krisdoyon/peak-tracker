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
  const href = window.location.pathname.slice(1);
  href === "map" && controlMap();
  href === "peak-list-preview" && controlPeakListPreview();
  href === "peak-list-table" && controlPeakListTable();
  href === "log-preview" && controlLogPreview();
  href === "log-entry" && controlLogEntry();
  href === "stats" && controlStats();
  href === "new-entry" && controlNewEntry();
};

const controlGoBack = function (containerID) {
  if (containerID === "peak-list-preview") {
    model.loadPeakListPreviewData();
    peakListPreviewView.render(
      model.getListPreviewPage(model.state.peakPreview.previewType, 1)
    );
    peakListPreviewView.showContainer();
  }
  if (containerID === "log-preview") {
    logPreviewView.render(
      model.getLogPreviewPage(model.state.logPreview.curSelectValues, 1)
    );
    logPreviewView.showContainer();
  }
  mapView.clearMap();
};

const controlLoadTestData = function () {
  model.loadTestData();
  model.loadLogPreviewData();
  logPreviewView.render(model.state.logPreview);
  logPreviewView.showContainer();
};

const controlClearAllData = function () {
  model.clearAllData();
};

const controlOpenModal = function () {
  modalView.openModal();
};

const controlFirstVisit = function () {
  model.firstVisit && modalView.openModal();
  model.setSessionStorage();
};

const controlSidebar = function () {
  model.updateSidebarHidden();
  sidebarView.toggleSidebar(model.state.sidebarHidden);
};

/////////////////////////////////////////////////////////////////////////////////
// MAP

const controlMap = function () {
  mainView.closeContainer();
  mapView.clearMap();
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
  mapView.clearMap();
  model.loadPeakListPreviewData();
  peakListPreviewView.render(model.getListPreviewPage(previewType, page));
  peakListPreviewView.showContainer();
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
  mapView.clearMap();
  logPreviewView.render(model.getLogPreviewPage(curSelectValues, page));
  logPreviewView.showContainer();
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
  mapView.clearMap();
  statsView.render(model.getStatsData());
  statsView.showContainer();
};

const controlStatsSelects = function (selectValues) {
  statsView.render(model.getStatsData(selectValues));
};

/////////////////////////////////////////////////////////////////////////////////
// NEW ENTRY

const controlNewEntry = function () {
  if (model.state.newEntry.curSelectValue) {
    model.loadMapData("list", model.state.newEntry.curSelectValue);
    newEntryView.displayCheckboxes(
      model.getCheckboxData(model.state.newEntry.curSelectValue)
    );
    mapView.plotPeaksOnMap(model.state.map);
  }
  newEntryView.showContainer();
};

const controlClearForm = function () {
  model.resetNewEntryState();
  newEntryView.clearForm();
  mapView.clearMap();
};

const controlFormAddEntry = function (formData) {
  model.addLogEntry(formData);
  model.loadMapData("log", model.state.curLogEntry.logID);
  logEntryView.render(model.state.curLogEntry);
  mapView.plotPeaksOnMap(model.state.map);
  logEntryView.showContainer();
};

const controlNewEntryDate = function (date) {
  newEntryView.changeDate(model.getDate(date));
};

const controlFormSelect = function (listID) {
  model.loadMapData("list", listID);
  newEntryView.displayCheckboxes(model.getCheckboxData(listID));
  mapView.plotPeaksOnMap(model.state.map);
};

const init = function () {
  mapView.loadMap();
  mapView.addHandlerNavClick(controlMap);
  mapView.addHandlerGetLocation(controlLocation);
  mapView.addHandlerLoadData(controlLoadTestData);
  mapView.addHandlerClearAllData(controlClearAllData);

  modalView.addHandlerLoadData(controlLoadTestData);

  mainView.addHandlerCloseContainer(controlMap);
  mainView.addHandlerBtnBack(controlGoBack);

  mainView.addHandlerPageLoad(controlPageLoad);

  sidebarView.addHandlerBtnAbout(controlOpenModal);
  sidebarView.addHandlerSidebar(controlSidebar);
  sidebarView.toggleSidebar(model.state.sidebarHidden);

  peakListPreviewView.addHandlerViewTable(controlPeakListTable);
  peakListPreviewView.addHandlerSavedLists(controlSavedListsPreview);
  peakListPreviewView.addHandlerPreviewType(controlPeakListPreview);
  peakListPreviewView.addHandlerPagination(controlPeakListPreview);

  peakListPreviewView.addHandlerNavClick(controlPeakListPreview);
  peakListTableView.addHandlerSortTable(controlTableSort);
  peakListTableView.addHandlerRowHover(controlTableRowHover);
  peakListTableView.addHandlerSavedLists(controlSavedListsTable);
  peakListTableView.addHandlerLogTrip(controlLogTrip);

  logPreviewView.addHandlerNavClick(controlLogPreview);
  logPreviewView.addHandlerShowEntry(controlLogEntry);
  logPreviewView.addHandlerDeleteEntry(controlDeleteLogEntry);
  logPreviewView.addHandlerAddEntry(controlNewEntry);
  logPreviewView.addHandlerLogSelects(controlLogSelects);
  logPreviewView.addHandlerPagination(controlLogPreview);

  logEntryView.addHandlerDeleteEntry(controlDeleteLogEntry);
  logEntryView.addHandlerViewMap(controlLogViewBtns);

  newEntryView.initializeListSelect(model.getListSelectData());
  newEntryView.addHandlerNavClick(controlNewEntry);
  newEntryView.addHandlerDate(controlNewEntryDate);
  newEntryView.addHandlerPeakListSelect(controlFormSelect);
  newEntryView.addHandlerAddEntry(controlFormAddEntry);
  newEntryView.addHandlerClearForm(controlClearForm);

  statsView.addHandlerLogSelects(controlStatsSelects);
  statsView.addHandlerAddEntry(controlNewEntry);
  statsView.addHandlerNavClick(controlStats);

  controlFirstVisit();
};

init();
