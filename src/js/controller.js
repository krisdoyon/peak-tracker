import * as model from "./model.js";
import newEntryView from "./views/newEntryView.js";
import mainView from "./views/mainView.js";
import mapView from "./views/mapView.js";
import peakListView from "./views/peakListView.js";

// MAIN VIEW

const controlBtnBack = function (containerID) {
  mainView.displayContainer(containerID);
};

const controlCloseContainer = function () {
  mainView.closeMainContainer();
  newEntryView.clearNewEntryForm();
  mapView.clearMap();
};

const controlMainNavClick = function (containerID) {
  if (containerID === "map") {
    mainView.closeMainContainer();
    return;
  }
  mainView.displayContainer(containerID);
  if (containerID === "all-history") {
    // Update and display history
  }
  if (containerID === "all-peak-lists") {
    peakListView.displayPeakLists(model.getPeakListsArr(), model.currentUser);
  }
};

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

// PEAK LISTS

const controlPeakListView = function (listID) {
  mainView.displayContainer("single-peak-list");
  model.sortPeakList(listID, "elevation");
  peakListView.displaySinglePeakList(
    model.getPeakList(listID),
    model.currentUser
  );
  mapView.plotListOnMap(model.getPeakList(listID), model.currentUser);
};

const controlLogTrip = function (listID, mtnID) {
  mainView.displayContainer("new-entry");
  newEntryView.displayCheckboxes(
    model.getCheckboxDisplayArr(listID),
    listID,
    mtnID
  );
  mapView.plotListOnMap(model.getPeakList(listID), model.currentUser);
};

// NEW ENTRY

const controlAddEntry = function (data) {
  model.currentUser.addLogEntry
  // Create a new log entry
  // Add the new entry to the user's log entries array
  // Update the map
  console.log(data);
};

const controlNewEntryDate = function (date) {
  newEntryView.changeDate(model.getDate(date));
};

const controlPeakListSelect = function (listID) {
  newEntryView.displayCheckboxes(model.getCheckboxDisplayArr(listID));
  // Show peak list on map
};

const init = function () {
  newEntryView.addHandlerDateClick(controlNewEntryDate);
  newEntryView.addHandlerChangeListSelect(controlPeakListSelect);
  newEntryView.addHandlerAddEntry(controlAddEntry);
  mainView.addHandlerCloseMainContainer(controlCloseContainer);
  mainView.addHandlerMainNavClick(controlMainNavClick);
  peakListView.addPeakListViewHandler(controlPeakListView);
  peakListView.addHandlerBtnBack(controlBtnBack);
  peakListView.addHandlerLogTrip(controlLogTrip);
  initializeMap();
};

init();
