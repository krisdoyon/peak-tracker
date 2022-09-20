"use strict";

///////////////////////////////////////////////////////////////////////////////////
// GLOBAL VARIABLES
let openContainer;
let newEntry;
let sidebarHidden = false;
let map;

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
const btnCloseModal = document.querySelector(".btn-close-modal");

// PEAK LISTS CONTAINER
const peakListsEl = document.querySelector(".peak-lists");

// NEW ENTRY CONTAINER
const formNewEntry = document.querySelector(".form-new-entry");
const inputTitle = document.querySelector("#title");
const inputDate = document.querySelector("#date");
const btnToday = document.querySelector(".btn-today");
const btnYesterday = document.querySelector(".btn-yesterday");
const gridStats = document.querySelector(".grid-stats");
const statRowIcons = [...document.querySelectorAll(".stat-row__icon")];
const statRows = document.querySelectorAll(".stat-row");
const inputHours = document.querySelector("#hours");
const inputMinutes = document.querySelector("#minutes");
const inputElevation = document.querySelector("#elevation");
const inputDistance = document.querySelector("#distance");
const wrapperStars = document.querySelector(".wrapper-stars");
const allStars = [...document.querySelectorAll(".star-icon")];
const btnClearForm = document.querySelector(".btn-clear-form");
const btnAddEntry = document.querySelector(".btn-add-entry");

///////////////////////////////////////////////////////////////////////////////////
// CLASSES

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
      this.markers.push(new L.Marker([peakObj.lat, peakObj.long]));
      this.markersLayer = L.layerGroup(this.markers);
    });
  }

  plotPeaksOnMap() {
    this.createMarkerLayer();
    this.markersLayer.addTo(map);
    map.setView(this.center, this.zoom);
  }

  clearPeaksOnMap() {
    this.markersLayer.clearLayers();
  }
}

class LogEntry {
  peaks = [];
  constructor(description, date, elevation, hours, min, notes, peaks) {
    this.description = description;
    this.date = date;
    this.elevation = elevation;
    this.hours = hours;
    this.min = min;
    this.time = hours + min / 60;
    this.notes = notes;
    peaks.forEach((peak) => this.peaks.push(peak));
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
  getCoords() {
    // if (!navigator.geolocation) return [44.0444, 71.6684];
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      const coords = [latitude, longitude];
      this.coords = coords;
      return coords;
    });
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

///////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS

const clearNewEntryForm = function () {
  allStars.forEach((star) => {
    clearStar(star);
    star.dataset.clicked = "false";
  });
  statRowIcons.forEach((icon) => (icon.textContent = "add_circle"));
  statRows.forEach((row) => row.classList.add("invisible"));
  formNewEntry.reset();
};

const closeModal = function () {
  containers.forEach((container) => container.classList.add("hidden"));
  containerMain.classList.add("hidden");
  clearNewEntryForm();
  mainNavBtns.forEach((btn) => {
    btn.classList.remove("main-nav__btn--active");
    btn.dataset.container === "map" &&
      btn.classList.add("main-nav__btn--active");
  });
};

const displayContainer = function (container) {
  containers.forEach((container) => container.classList.add("hidden"));
  containerMain.classList.remove("hidden");
  container.classList.remove("hidden");
};

const displayAllPeakLists = function () {
  peakListsArr.forEach((peakList) =>
    peakListsEl.insertAdjacentHTML(
      "beforeend",
      `<li class="peak-list">
      <button class="btn btn--icon btn-add-peak" data-id='${peakList.id}'>
        <span class="material-icons"> post_add </span>
      </button>
      <div class="peak-list__info">
        <h2 class="peak-list__label-title">${peakList.title}</h2>
        <span class="peak-list__label-number">${peakList.peakCount} Mountains</span>
      </div>
    </li>`
    )
  );
};

displayAllPeakLists();

///////////////////////////////////////////////////////////////////////////////////
// EVENT HANDLER

// SIDEBAR

btnSidebar.addEventListener("click", function () {
  sidebarHidden = sidebarHidden ? false : true;
  // FIXME
  sidebar.style.marginLeft = `${sidebarHidden ? "-17.8rem" : "0"}`;
  btnSidebarIcon.innerHTML = sidebarHidden ? "chevron_right" : "chevron_left";
});

mainNavList.addEventListener("click", function (e) {
  const clicked = e.target.closest(".main-nav__btn");
  if (!clicked) return;
  if (clicked.dataset["container"] === "map") {
    closeModal();
  } else {
    displayContainer(
      document.querySelector(`.${clicked.dataset["container"]}`)
    );
  }
  mainNavBtns.forEach((link) => link.classList.remove("main-nav__btn--active"));
  clicked.classList.add("main-nav__btn--active");
});

// MAIN CONTAINER

btnCloseModal.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  e.key === "Escape" &&
    !modalNewEntry.classList.contains("hidden") &&
    closeModal();
});

// PEAK LISTS CONTAINER

peakListsEl.addEventListener("click", function (e) {
  const clicked = e.target.closest(".btn-add-peak");
  if (!clicked) return;
  if (!currentUser.savedLists.includes(clicked.dataset.id)) {
    currentUser.savedLists.push(clicked.dataset.id);
    clicked.children[0].textContent = "done";
  } else {
    clicked.children[0].textContent = "post_add";
    currentUser.savedLists.splice(
      currentUser.savedLists.indexOf(clicked.dataset.id),
      1
    );
  }
});

// TEMPORARY, CHANGE TO CLICKING ON TITLE OR "VIEW ON MAP" BUTTON
peakListsEl.addEventListener("click", function (e) {
  const clicked = e.target.closest(".btn-add-peak");
  if (!clicked) return;
  const obj = peakListsArr.find(
    (peakList) => peakList.id === clicked.dataset.id
  );
  peakListsArr.forEach((peak) => peak.clearPeaksOnMap());
  obj.plotPeaksOnMap();
});

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
  e.target.textContent = icon === "add_circle" ? "remove_circle" : "add_circle";
});

const fillStar = function (star) {
  star.textContent = "star";
  star.classList.add("star-icon--full");
};

const clearStar = function (star) {
  star.textContent = "star_border";
  star.classList.remove("star-icon--full");
};

wrapperStars.addEventListener("mouseover", function (e) {
  const hovered = e.target.closest(".star-icon");
  if (!hovered) return;
  allStars.forEach(function (star) {
    if (star.dataset.num <= hovered.dataset.num) {
      fillStar(star);
    } else {
      clearStar(star);
    }
  });
});

wrapperStars.addEventListener("mouseout", function (e) {
  allStars.forEach(function (star) {
    if (star.dataset.clicked === "false") {
      clearStar(star);
    } else {
      fillStar(star);
    }
  });
});

wrapperStars.addEventListener("click", function (e) {
  e.preventDefault();
  const clicked = e.target.closest(".btn-star");
  if (!clicked) return;
  allStars.forEach(function (star) {
    if (star.dataset.num <= clicked.dataset.num) {
      fillStar(star);
      star.dataset.clicked = "true";
    } else {
      clearStar(star);
      star.dataset.clicked = "false";
    }
  });
});

btnClearForm.addEventListener("click", function () {
  clearNewEntryForm();
});

btnAddEntry.addEventListener("click", function () {
  newEntry = new Entry(
    title.value,
    date.value,
    elevation.value,
    hours.value,
    minutes.value,
    "test log",
    ["Mt Washington", "Mt.Jefferson"]
  );
});

///////////////////////////////////////////////////////////////////////////////////
// GEOLOCATION API
// BUG BUG BUG
// const displayMap = function (lat = 44.0444, long = -71.6684, peaksObjArr) {
//   const coords = [lat, long];
// };

///////////////////////////////////////////////////////////////////////////////////
// CREATE THE MAP

const coords = [41.7658, -72.6734];

map = new L.Map("map", {
  zoomControl: false,
}).setView(coords, 13);

L.tileLayer("https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png", {
  maxZoom: 50,
  attribution:
    '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
}).addTo(map);

L.control
  .zoom({
    position: "bottomright",
  })
  .addTo(map);
