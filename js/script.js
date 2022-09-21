"use strict";

///////////////////////////////////////////////////////////////////////////////////
// GLOBAL VARIABLES
let sidebarHidden = false;
// let map;

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

// SIDEBAR
const sidebar = document.querySelector(".sidebar");
const btnSidebar = document.querySelector(".sidebar__btn");
const btnSidebarIcon = document.querySelector(".sidebar__btn--icon");
const mainNavBtns = document.querySelectorAll(".main-nav__btn");
const mainNavList = document.querySelector(".main-nav__list");

// CONTAINERS
const containerMain = document.querySelector(".container-main");
const containers = document.querySelectorAll(".container");
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

// USER INPUTS
const inputDate = document.querySelector("#date");
const inputElevation = document.querySelector("#elevation");
const inputDistance = document.querySelector("#distance");
const inputHours = document.querySelector("#hours");
const inputMinutes = document.querySelector("#minutes");
const inputNotes = document.querySelector("#notes");

const gridStats = document.querySelector(".grid-stats");
const statRowIcons = [...document.querySelectorAll(".stat-row__icon")];
const statRows = document.querySelectorAll(".stat-row");

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
  constructor() {
    this._getCoords();
    this._displayAllPeakLists();

    /////////////////////////////////////////////////////////////////////////////////
    // EVENT HANDLERS

    // SIDEBAR
    btnSidebar.addEventListener("click", function () {
      sidebarHidden = sidebarHidden ? false : true;
      // FIXME
      sidebar.style.marginLeft = `${sidebarHidden ? "-17.8rem" : "0"}`;
      btnSidebarIcon.innerHTML = sidebarHidden
        ? "chevron_right"
        : "chevron_left";
    });

    mainNavList.addEventListener("click", this._mainNavClick.bind(this));

    // MAIN CONTAINER
    btnCloseContainer.addEventListener(
      "click",
      this._closeContainer.bind(this)
    );

    document.addEventListener("keydown", function (e) {
      e.key === "Escape" &&
        !modalNewEntry.classList.contains("hidden") &&
        _closeContainer();
    });

    // // PEAK LISTS CONTAINER

    peakListsEl.addEventListener("click", this._peakListClick.bind(this));

    btnBack.addEventListener(
      "click",
      this._displayContainer.bind(
        this,
        document.querySelector(`.${btnBack.dataset["container"]}`)
      )
    );

    btnBack.addEventListener("click", this._clearMap.bind(this));

    // NEW ENTRY CONTAINER
    btnToday.addEventListener("click", function (e) {
      e.preventDefault();
      date.value = today;
    });
    btnYesterday.addEventListener("click", function (e) {
      e.preventDefault();
      date.value = yesterday;
    });

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

    btnAddEntry.addEventListener("click", function (e) {
      e.preventDefault();

      const newEntry = new LogEntry(
        date.value,
        elevation.value,
        distance.value,
        hours.value,
        minutes.value,
        "test notes"
      );
      currentUser.addLogEntry(newEntry);
    });
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

    L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 50,
        attribution:
          '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      }
    ).addTo(this.#map);

    L.control
      .zoom({
        position: "bottomright",
      })
      .addTo(this.#map);
  }

  _clearMap() {
    peakListsArr.forEach((peakObj) => peakObj.clearPeaksOnMap());
  }

  _clearNewEntryForm() {
    // allStars.forEach((star) => {
    //   this._clearStar(star);
    //   star.dataset.clicked = "false";
    // });
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
      this._displayContainer(
        document.querySelector(`.${clicked.dataset["container"]}`)
      );
    }
    mainNavBtns.forEach((link) =>
      link.classList.remove("main-nav__btn--active")
    );
    clicked.classList.add("main-nav__btn--active");
    this._clearMap();
  }

  _peakListClick(e) {
    const { id } = e.target.closest(".peak-list").dataset;
    if (e.target.classList.contains("btn-view-list")) {
      this._displaySinglePeakList(id);
    }
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

  _displayContainer(container) {
    containers.forEach((container) => container.classList.add("hidden"));
    containerMain.classList.remove("hidden");
    container.classList.remove("hidden");
  }

  _displayAllPeakLists() {
    peakListsArr.forEach((peakList) =>
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
      </div>
        <button class="btn btn--dark btn-view-list">VIEW</button>
    </li>`
      )
    );
  }

  _displaySinglePeakList(peakListID, sort = "alphabetical") {
    // Set the title and # of mountains labels
    this._displayContainer(containerSinglePeakList);
    // Get the correct peak object to display
    const currentPeakObj = getPeakObjFromID(peakListID);

    // Display this single peak list container
    if (sort === "elevation") {
      currentPeakObj.data.sort((a, b) => b.elevFeet - a.elevFeet);
    }

    if (sort === "alphabetical") {
      currentPeakObj.data.sort((currentPeakObj) => currentPeakObj.name);
      currentPeakObj.data.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
    }

    containerSinglePeakList.querySelector(
      ".container__heading"
    ).textContent = `${currentPeakObj.title}`;
    containerSinglePeakList.querySelector(
      ".peak-list__label-number"
    ).textContent = `${currentPeakObj.peakCount} Mountains`;

    // Clear the Map
    this._clearMap();
    // Set the view according to the object
    this.#map.setView(currentPeakObj.center, currentPeakObj.zoom);
    // Create marker layer
    currentPeakObj.createMarkerLayer();
    this.#map.addLayer(currentPeakObj.markersLayer);

    // currentPeakObj.markersLayer.addTo(this.#map);

    peakListTableBody.innerHTML = "";
    currentPeakObj.data.forEach((peakObj, i) => {
      peakListTableBody.insertAdjacentHTML(
        "beforeend",
        `<tr class="peak-list__table-row">
                <td>${i + 1}</td>
                <td style="text-align:left">${peakObj.name}</td>
                <td>${peakObj.state}</td>

                <td>${peakObj.elevFeet.toLocaleString(undefined)}</td>
                <td>LOG TRIP</td>
              </tr>`
      );
    });
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
    this.createMarkerLayer();
  }

  createMarkerLayer() {
    this.data.forEach((peakObj) => {
      this.markers.push(
        new L.Marker([peakObj.lat, peakObj.long])
          .bindPopup(L.popup({ className: "peak-popup", minWidth: 200 }))
          .setPopupContent(`<span>${peakObj.name}</span>`)
      );
      this.markersLayer = L.layerGroup(this.markers);
    });
  }

  clearPeaksOnMap() {
    this.markersLayer.clearLayers();
  }
}

class LogEntry {
  peaks = [];
  constructor(
    date,
    // peaks,
    elevation,
    distance,
    hours,
    min,
    notes
  ) {
    this.date = date;
    // peaks.forEach((peak) => this.peaks.push(peak));
    this.elevation = elevation;
    this.distance = distance;
    this.hours = hours;
    this.min = min;
    this.notes = notes;
    this.init();
  }

  init() {
    if (this.hours && this.min) this.time = hours + min / 60;
    if (this.distance && this.time)
      this.avgSpeedMPH = this.distance / this.time;
  }
}

class User {
  savedLists = [];
  logEntires = [];
  completedPeaks = [];
  coords;
  constructor(firstName, username) {
    this.firstName = firstName;
    this.username = username;
    this.locale = navigator.locale;
  }

  addLogEntry(entry) {
    this.logEntires.push(entry);
  }
  removeLogEntry(entry) {
    this.logEntires.slice(this.logEntires.indexOf(entry), 1);
  }
}

const currentUser = new User("Kris", "kristopher.doyon");

// TODO TODO TODO ADD ALL LIST OBJECTS
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

const peakListsArr = [nh4k, vt4k, neHigh];

const app = new App();

// handleStarHover(e) {
//   const hovered = e.target.closest(".star-icon");
//   if (!hovered) return;

// }

//       allStars.forEach(function (star) {
//         if (star.dataset.num <= hovered.dataset.num) {
//           this._fillStar(star);
//         } else {
//           this._clearStar(star);
//         }

// }

// fillstars() {

// }

// wrapperStars.addEventListener("mouseover", function (e) {
//       c
//       });
//     });

//     _fillStars() {}

//
//

//
