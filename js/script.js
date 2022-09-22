"use strict";

///////////////////////////////////////////////////////////////////////////////////
// GLOBAL VARIABLES

// DATE
const options = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
};

const now = new Date();
const today = new Intl.DateTimeFormat("en-CA", options).format(now);
const yesterday = new Intl.DateTimeFormat("en-CA", options).format(
  new Date(now.getTime() - 86400000)
);

///////////////////////////////////////////////////////////////////////////////////
// DOM ELEMENTS

// MAP
const peakPopups = document.getElementsByClassName("peak-popup");

// SIDEBAR
const sidebar = document.querySelector(".sidebar");
const btnSidebar = document.querySelector(".sidebar__btn");
const btnSidebarIcon = document.querySelector(".sidebar__btn--icon");
const mainNavBtns = document.querySelectorAll(".main-nav__btn");
const mainNavList = document.querySelector(".main-nav__list");

// CONTAINERS
const containerMain = document.querySelector(".container-main");
const containers = [...document.querySelectorAll(".container")];
const btnCloseContainer = document.querySelector(".btn-close-container");

// PEAK LISTS CONTAINER
const peakListsEl = document.querySelector(".peak-lists");
const peakListTableBody = document.querySelector(".peak-list__table-body");
const containerSinglePeakList = document.querySelector(
  ".container-single-peak-list"
);
const btnBack = document.querySelector(".btn-back");
const btnsViewList = document.getElementsByClassName("btn-view-list");

// NEW ENTRY CONTAINER
const formNewEntry = document.querySelector("#form-new-entry");

const inputDate = document.querySelector("#date");
const inputElevation = document.querySelector("#elevation");
const inputDistance = document.querySelector("#distance");
const inputHours = document.querySelector("#hours");
const inputMinutes = document.querySelector("#minutes");
const inputNotes = document.querySelector("#notes");

const chooseListSelect = document.querySelector("#choose-list");

const gridStats = document.querySelector(".grid-stats");
const statRowIcons = [...document.querySelectorAll(".stat-row__icon")];
const statRows = document.querySelectorAll(".stat-row");

const gridPeakCheckboxes = document.querySelector(".grid-peak-checkboxes");

const wrapperStars = document.querySelector(".wrapper-stars");
const allStarIcons = [...document.querySelectorAll(".star-icon")];
const allStarButtons = [...document.querySelectorAll(".btn-star")];

const btnToday = document.querySelector(".btn-today");
const btnYesterday = document.querySelector(".btn-yesterday");
const btnClearForm = document.querySelector(".btn-clear-form");
const btnAddEntry = document.querySelector(".btn-add-entry");

///////////////////////////////////////////////////////////////////////////////////
// GLOBAL FUNCTIONS

const getPeakObjFromID = function (peakListID) {
  return peakListsArr.find((peakList) => peakList.id === peakListID);
};

///////////////////////////////////////////////////////////////////////////////////
// CLASSES

class App {
  #map;
  #latitude;
  #longitude;
  #coords;
  sidebarHidden;
  constructor() {
    this._getCoords();
    this._displayAllPeakLists();

    /////////////////////////////////////////////////////////////////////////////////
    // EVENT HANDLERS

    // document.addEventListener("click", function (e) {
    //   const clicked = e.target.closest(".btn-log-trip");
    // });

    // SIDEBAR
    btnSidebar.addEventListener("click", function () {
      this.sidebarHidden = this.sidebarHidden ? false : true;
      // FIXME
      sidebar.style.marginLeft = `${this.sidebarHidden ? "-17.8rem" : "0"}`;
      btnSidebarIcon.innerHTML = this.sidebarHidden
        ? "chevron_right"
        : "chevron_left";
    });

    mainNavList.addEventListener("click", this._mainNavClick.bind(this));

    // MAIN CONTAINER
    btnCloseContainer.addEventListener(
      "click",
      this._closeContainer.bind(this)
    );

    document.addEventListener(
      "keydown",
      function (e) {
        e.key === "Escape" &&
          !containerMain.classList.contains("hidden") &&
          this._closeContainer();
      }.bind(this)
    );

    // ALL PEAK LISTS CONTAINER EVENT HANDLERS

    peakListsEl.addEventListener("click", this._peakListClick.bind(this));

    // SINGLE PEAK LISTS CONTAINER EVENT HANDLERS

    btnBack.addEventListener(
      "click",
      this._displayContainer.bind(
        this,

        `${btnBack.dataset.container}`
      )
    );

    document.addEventListener(
      "click",
      function (e) {
        const clicked = e.target.closest(".btn-log-trip");
        if (!clicked) return;
        this._displayContainer("new-entry");
        this._displayPeakListCheckboxes(clicked.dataset.listId);
        chooseListSelect.value = clicked.dataset.listId;
        const checkbox = [...gridPeakCheckboxes.querySelectorAll("input")].find(
          (input) => input.value === String(clicked.dataset.mtnId)
        );
        checkbox.checked = "true";
      }.bind(this)
    );

    btnBack.addEventListener("click", this._clearMap.bind(this));

    // NEW ENTRY CONTAINER EVENT HANDLERS

    btnToday.addEventListener("click", function (e) {
      e.preventDefault();
      date.value = today;
    });

    btnYesterday.addEventListener("click", function (e) {
      e.preventDefault();
      date.value = yesterday;
    });

    chooseListSelect.addEventListener(
      "change",
      function (e) {
        this._displayPeakListCheckboxes(e.target.value);
      }.bind(this)
    );

    gridStats.addEventListener("click", function (e) {
      e.preventDefault();
      const clicked = e.target.closest(".btn-add-stat");
      let icon = e.target.textContent.trim();
      if (!clicked) return;
      statRows.forEach(
        (row) =>
          row.dataset.stat === clicked.dataset.stat &&
          row.classList.toggle("invisible")
      );
      e.target.textContent =
        icon === "add_circle" ? "remove_circle" : "add_circle";
    });

    wrapperStars.addEventListener(
      "mouseover",
      this._handleStarMouseOver.bind(this)
    );

    wrapperStars.addEventListener(
      "mouseout",
      this._handleStarMouseOut.bind(this)
    );

    wrapperStars.addEventListener("click", this._handleStarClick.bind(this));

    btnClearForm.addEventListener("click", this._clearNewEntryForm.bind(this));

    btnAddEntry.addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        if (!inputDate.value) {
          alert("Please enter a date");
          return;
        }
        const peaks = this._getCheckedPeaks();
        if (peaks.length <= 0) {
          alert("Choose at least one peak from a list");
          return;
        }

        const rating = allStarButtons.filter(
          (star) => star.dataset.filled === "true"
        ).length;

        const date = new Date(inputDate.value);

        const formattedDate = new Intl.DateTimeFormat("en-US", {
          day: "numeric",
          year: "numeric",
          month: "numeric",
        }).format(date);

        const newEntry = new LogEntry(
          formattedDate,
          peaks,
          chooseListSelect.value,
          inputElevation.value,
          inputDistance.value,
          inputHours.value,
          inputMinutes.value,
          inputNotes.value,
          rating
        );
        currentUser.addLogEntry(newEntry);
        this._plotListOnMap(chooseListSelect.value);
        this._clearNewEntryForm();
      }.bind(this)
    );
  }

  _getCoords() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        this._loadMap.bind(this)
      );
    }
  }

  _loadMap(position) {
    this.#latitude = position.coords ? position.coords["latitude"] : 44.0444;
    this.#longitude = position.coords ? position.coords["longitude"] : -71.6684;
    this.#coords = [this.#latitude, this.#longitude];
    this.#map = new L.Map("map", {
      zoomControl: false,
    }).setView(this.#coords, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // L.tileLayer(
    //   "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png",
    //   {
    //     maxZoom: 50,
    //     attribution:
    //       '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    //   }
    // ).addTo(this.#map);

    L.control
      .zoom({
        position: "bottomright",
      })
      .addTo(this.#map);

    this.#map.on("click", function (mapEvent) {
      console.log(mapEvent);
    });
  }

  _clearMap() {
    peakListsArr.forEach((peakObj) => peakObj.clearPeaksOnMap());
  }

  _plotListOnMap(peakID) {
    const peakListObj = peakListsArr.find((peakObj) => peakObj.id === peakID);
    // clear the map
    this._clearMap();
    // Set the view according to the object
    this.#map.setView(peakListObj.center, peakListObj.zoom);
    // Create marker layer to be added
    peakListObj.createMarkerLayer();
    // Add marker layer to map
    this.#map.addLayer(peakListObj.markersLayer);
  }

  _clearNewEntryForm() {
    for (const starIcon of allStarIcons) {
      this._clearStar(starIcon);
      starIcon.closest(".btn-star").dataset.filled = "false";
    }
    gridPeakCheckboxes.innerHTML = "";
    gridPeakCheckboxes.classList.add("hidden");
    statRowIcons.forEach((icon) => (icon.textContent = "add_circle"));
    statRows.forEach((row) => row.classList.add("invisible"));
    formNewEntry.reset();
  }

  _closeContainer() {
    containers.forEach((container) => container.classList.add("hidden"));
    containerMain.classList.add("hidden");
    this._clearNewEntryForm();
    mainNavBtns.forEach((btn) => {
      btn.classList.remove("main-nav__btn--active");
      btn.dataset.container === "map" &&
        btn.classList.add("main-nav__btn--active");
    });
    this._clearMap();
  }

  _mainNavClick(e) {
    const clicked = e.target.closest(".main-nav__btn");
    if (!clicked) return;
    if (clicked.dataset["container"] === "map") {
      this._closeContainer();
    } else {
      this._displayContainer(`${clicked.dataset["container"]}`);
      // clicked.dataset["container"] === "new-entry" || this._clearNewEntryForm();
    }
    this._clearMap();
  }

  _peakListClick(e) {
    const { id } = e.target.closest(".peak-list").dataset;
    if (e.target.closest(".btn-view-list")) {
      this._displaySinglePeakList(id);
    }

    // Save peak button
    if (e.target.closest(".btn-add-peak")) {
      if (!currentUser.savedLists.includes(id)) {
        currentUser.savedLists.push(id);
        e.target.textContent = "done";
      } else {
        e.target.textContent = "post_add";
        currentUser.savedLists.splice(currentUser.savedLists.indexOf(id), 1);
      }
    } else return;
  }

  _displayContainer(containerID) {
    const containerObj = containers.find((container) =>
      container.classList.contains(`container-${containerID}`)
    );
    containers.forEach((container) => container.classList.add("hidden"));
    containerMain.classList.remove("hidden");
    containerObj.classList.remove("hidden");
    containerID === "all-peak-lists" && this._displayAllPeakLists();

    mainNavBtns.forEach((btn) => {
      btn.classList.remove("main-nav__btn--active");
      btn.dataset.container === containerObj.dataset.navId &&
        btn.classList.add("main-nav__btn--active");
    });
  }

  _displayAllPeakLists() {
    peakListsEl.innerHTML = "";
    peakListsArr.forEach((peakList) => {
      const width =
        (currentUser.listCounts[peakList.id] / peakList.data.length) * 100;
      peakListsEl.insertAdjacentHTML(
        "beforeend",
        `<li class="peak-list" data-id="${peakList.id}">
        <button class="btn btn--icon btn-add-peak" data-id='${peakList.id}'>
        <span class="material-icons"> ${
          currentUser.savedLists.includes(peakList.id) ? "done" : "post_add"
        } </span>
      </button>
      <div class="peak-list__info">
        <h2 class="peak-list__label-title">${peakList.title}</h2>
        <span class="peak-list__label-number">${
          peakList.peakCount
        } Mountains</span>
        <div class='progress-bar'><div class='progress-bar__label'>${
          Math.round(width * 10) / 10
        }%</div><div class='progress' style="width:${width}%"></div></div>
      </div>
        <button class="btn btn--dark btn-view-list">VIEW</button>
    </li>`
      );
    });
  }

  _sortPeakList(peakListID, sortType) {
    const currentPeakListObj = getPeakObjFromID(peakListID);
    if (sortType === "elevation") {
      currentPeakListObj.data.sort((a, b) => b.elevFeet - a.elevFeet);
    }
    if (sortType === "alphabetical") {
      currentPeakListObj.data.sort((currentPeakObj) => currentPeakObj.name);
      currentPeakListObj.data.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
    }
  }

  _displaySinglePeakList(peakListID) {
    // Set the title and # of mountains labels
    this._displayContainer("single-peak-list");
    // Get the correct peak object to display
    const currentPeakObj = getPeakObjFromID(peakListID);
    // Display this single peak list container

    // Set the labels
    containerSinglePeakList.querySelector(
      ".container__heading"
    ).textContent = `${currentPeakObj.title}`;
    containerSinglePeakList.querySelector(
      ".peak-list__label-number"
    ).textContent = `${currentPeakObj.peakCount} Mountains`;

    this._plotListOnMap(peakListID);

    // Reset the table body
    peakListTableBody.innerHTML = "";
    // Add a row for each peak
    this._sortPeakList(peakListID, "elevation");
    currentPeakObj.data.forEach((peakObj, i) => {
      let logMatch;
      if (currentUser.logEntries.length) {
        logMatch = currentUser.logEntries.find((entry) =>
          entry.peaks.includes(peakObj.id)
        );
      }

      peakListTableBody.insertAdjacentHTML(
        "beforeend",
        `<tr class="peak-list__table-row ${
          logMatch ? "peak-list__table-row--complete" : ""
        }" data-mtn-id="${peakObj.id}" data-list-id="${currentPeakObj.id}">
                <td>${i + 1}</td>
                <td style="text-align:left">${peakObj.name}</td>
                <td>${peakObj.state}</td>

                <td>${peakObj.elevFeet.toLocaleString()}</td>
                <td>${
                  logMatch
                    ? `${logMatch.date}`
                    : `<button class='btn btn-log-trip' data-mtn-id='${peakObj.id}' data-list-id='${currentPeakObj.id}'>LOG TRIP</button>`
                }</td>
              </tr>`
      );
    });
  }

  // NEW ENTRY CONTAINER FUNCTIONS

  _displayPeakListCheckboxes(peakListID) {
    gridPeakCheckboxes.classList.remove("hidden");
    gridPeakCheckboxes.innerHTML = "";
    const currentPeakListObj = getPeakObjFromID(peakListID);
    this._sortPeakList(peakListID, "alphabetical");
    const arrCopy = currentPeakListObj.data.map((peakObj) => peakObj);
    const arrFirstHalf = arrCopy.splice(Math.ceil(arrCopy.length / 2));
    const displayArr = [];
    for (const [i, _] of arrCopy.entries()) {
      arrCopy[i] && displayArr.push(arrCopy[i]);
      arrFirstHalf[i] && displayArr.push(arrFirstHalf[i]);
    }

    displayArr.forEach((peakObj) =>
      gridPeakCheckboxes.insertAdjacentHTML(
        "beforeend",
        `<input type="checkbox" value="${peakObj.id}"/><label
                  for="title"
                  class="form__label--units"
                  >${peakObj.name}</label
                >`
      )
    );

    this._plotListOnMap(peakListID);
  }

  _getCheckedPeaks() {
    const checkboxes = gridPeakCheckboxes.querySelectorAll("input");
    const checkedPeaksArr = [];
    checkboxes.forEach(
      (checkbox) => checkbox.checked && checkedPeaksArr.push(+checkbox.value)
    );
    return checkedPeaksArr;
  }

  _handleStarMouseOver(e) {
    const hovered = e.target.closest(".btn-star");
    if (!hovered) return;
    for (const starBtn of allStarButtons) {
      const starIcon = starBtn.querySelector(".star-icon");
      starBtn.dataset.num <= hovered.dataset.num
        ? this._fillStar(starIcon)
        : this._clearStar(starIcon);
    }
  }

  _handleStarMouseOut(e) {
    for (const starBtn of allStarButtons) {
      const starIcon = starBtn.querySelector(".star-icon");
      if (starBtn.dataset.filled === "false") {
        this._clearStar(starIcon);
      } else {
        this._fillStar(starIcon);
      }
    }
  }

  _handleStarClick(e) {
    e.preventDefault();
    const clicked = e.target.closest(".btn-star");
    if (!clicked) return;
    for (const starBtn of allStarButtons) {
      const starIcon = starBtn.querySelector(".star-icon");
      if (starBtn.dataset.num <= clicked.dataset.num) {
        this._fillStar(starIcon);
        starBtn.dataset.filled = "true";
      } else {
        this._clearStar(starIcon);
        starBtn.dataset.filled = "false";
      }
    }
  }

  _fillStar(starIcon) {
    starIcon.textContent = "star";
    starIcon.classList.add("star-icon--full");
  }

  _clearStar(starIcon) {
    starIcon.textContent = "star_border";
    starIcon.classList.remove("star-icon--full");
  }
}

class PeakList {
  markers = [];
  constructor(title, id, data, center, zoom) {
    this.title = title;
    this.id = id;
    // An array of Mountan objects
    this.data = data;
    this.peakCount = data.length;
    this.center = center;
    this.zoom = zoom;
    // this.createMarkerLayer();
  }

  createMarker(peakObj, color = "red") {
    const mtnIcon = L.icon({
      iconUrl: `mtn-icon-${color}.png`,
      iconSize: [25, 20],
    });
    const marker = new L.Marker([peakObj.lat, peakObj.long], { icon: mtnIcon });
    marker.bindPopup(L.popup({})).setPopupContent(
      `<div class='peak-popup'>
              <span class='peak-popup__label-name'>${peakObj.name}</span>
              <span class='peak-popup__label-elevation'>${peakObj.elevFeet} ft.</span>
              <button class='btn btn-log-trip' data-mtn-id='${peakObj.id}' data-list-id='${this.id}'>LOG TRIP</button>
            </div>`
    );
    return marker;
  }

  createMarkerLayer() {
    this.data.forEach((peakObj) => {
      const color = `${
        currentUser.completedPeaks.includes(peakObj.id) ? "green" : "red"
      }`;
      const marker = this.createMarker(peakObj, color);
      this.markers.push(marker);
    });

    this.markersLayer = L.layerGroup(this.markers);
  }

  clearPeaksOnMap() {
    this.markersLayer && this.markersLayer.clearLayers();
    this.markers = [];
  }
}

class LogEntry {
  peaks = [];
  constructor(
    date,
    peaks,
    listID,
    elevation,
    distance,
    hours,
    min,
    notes,
    rating
  ) {
    this.date = date;
    peaks.forEach((peak) => this.peaks.push(peak));
    this.listID = listID;
    this.elevation = +elevation;
    this.distance = +distance;
    this.hours = +hours;
    this.min = +min;
    this.notes = notes;
    this.rating = rating;
    this.init();
  }

  init() {
    if (this.hours && this.min) this.time = this.hours + this.min / 60;
    if (this.distance && this.time)
      this.avgSpeedMPH = this.distance / this.time;
  }
}

class User {
  savedLists = [];
  logEntries = [];
  completedPeaks = [];
  listCounts = {};
  coords;
  constructor(firstName, username) {
    this.firstName = firstName;
    this.username = username;
    this.locale = navigator.locale;
    this.listCounts = {};

    this._getLocalStorage();
    this._initializeListCounts();
  }

  addLogEntry(entry) {
    this.logEntries.unshift(entry);
    entry.peaks.forEach((peakID) => {
      this._updateListCounts(peakID);
      this.completedPeaks.push(peakID);
    });

    // this.listCounts[`${entry.listID}`] += entry.peaks.length;
    this._setLocalStorage();
  }
  removeLogEntry(entry) {
    this.logEntries.slice(this.logEntries.indexOf(entry), 1);
  }

  _setLocalStorage() {
    localStorage.setItem("logEntries", JSON.stringify(this.logEntries));
    localStorage.setItem("completedPeaks", JSON.stringify(this.completedPeaks));
    localStorage.setItem("listCounts", JSON.stringify(this.listCounts));
  }

  _getLocalStorage() {
    if (localStorage.logEntries)
      this.logEntries = JSON.parse(localStorage.getItem("logEntries"));
    if (localStorage.completedPeaks)
      this.completedPeaks = JSON.parse(localStorage.getItem("completedPeaks"));
    if (localStorage.listCounts)
      this.listCounts = JSON.parse(localStorage.getItem("listCounts"));
  }

  _initializeListCounts() {
    peakListsArr.forEach((peakListObj) => {
      if (!this.listCounts[`${peakListObj.id}`])
        this.listCounts[`${peakListObj.id}`] = 0;
    });
  }

  _updateListCounts(peakID) {
    peakListsArr.forEach((peakListObj) => {
      if (!this.completedPeaks.some((id) => id === peakID)) {
        if (peakListObj.data.some((peakObj) => peakObj.id === peakID)) {
          this.listCounts[`${peakListObj.id}`] += 1;
        }
      }
    });
  }
}

// TODO TODO TODO ADD ALL LIST OBJECTS
co14 = new PeakList(
  "Colorado 14ers",
  "co14",
  co14,
  [38.76958342598271, -108.5459199218751],
  8
);

me4k = new PeakList(
  "Maine 4,000 Footers",
  "me4k",
  me4k,
  [45.11352900692261, -72.22412109375001],
  8
);

nh4k = new PeakList(
  "New Hampshire 4,000 Footers",
  "nh4k",
  nh4k,
  [44.20681942220478, -72.09640502929689],
  10
);

vt4k = new PeakList(
  "Vermont 4,000 Footers",
  "vt4k",
  vt4k,
  [44.08363928284644, -74.08355712890626],
  9
);

neHigh = new PeakList(
  "New England State Highpoints",
  "neHigh",
  neHigh,
  [43.739352079154706, -76.03637695312501],
  7
);

adk46 = new PeakList(
  "Adirondack High Peaks",
  "adk46",
  adk46,
  [44.09153051045221, -74.57519531250001],
  10
);

let ne4k = new PeakList(
  "New England 4,000 Footers",
  "ne4k",
  [...nh4k.data, ...me4k.data, ...vt4k.data],
  [44.54350521320822, -73.39753417968751],
  8
);

let ne100 = new PeakList(
  "New England 100 Highest",
  "ne100",
  [...ne4k.data, ...ne100rest],
  [44.54350521320822, -73.39753417968751],
  8
);

const peakListsArr = [co14, me4k, nh4k, vt4k, neHigh, adk46, ne4k, ne100];

const currentUser = new User("Kris", "kristopher.doyon");

const app = new App();
