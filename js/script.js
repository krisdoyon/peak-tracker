"use strict";

///////////////////////////////////////////////////////////////////////////////////
// GLOBAL VARIABLES
let openContainer;
let currentUser;
let newEntry;
let sidebarHidden = false;

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
  constructor(title, data) {
    this.title = title;
    // An array of Mountan objects
    this.data = data;
  }
}

class Entry {
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

///////////////////////////////////////////////////////////////////////////////////
// EVENT LISTENERS

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

// NEW ENTRY FORM

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
  console.log(hovered);
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

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      const coords = [latitude, longitude];

      const map = L.map("map", {
        zoomControl: false,
      }).setView(coords, 13);

      L.tileLayer(
        "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 50,
          attribution:
            '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        }
      ).addTo(map);

      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(map);

      L.marker(coords)
        .addTo(map)
        .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
        .openPopup();
    },
    function () {
      console.log("Could not get your position");
    }
  );
}
