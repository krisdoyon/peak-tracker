"use strict";

// listID = string, identifies peak list ("nh4k", "co14")
// peakID = string, identifies  individual peak ("845952")

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
const containers = [...document.querySelectorAll(".container")];
const btnCloseContainer = document.querySelector(".btn-close-container");

// PEAK LISTS CONTAINER
const peakListsEl = document.querySelector(".peak-lists");
const peakListTableBody = document.querySelector(".peak-list__table-body");
const containerSinglePeakList = document.querySelector(
  ".container-single-peak-list"
);
const btnBacks = [...document.getElementsByClassName("btn-back")];
const btnsViewList = document.getElementsByClassName("btn-view-list");

// HISTORY CONTAINER

const historyEntriesEl = document.querySelector(".history-entries-list");
const singleHistoryTable = document.querySelector(".single-history__table");

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

const getListFromID = function (peakListID) {
  return peakListsArr.find((peakList) => peakList.id === peakListID);
};

class App {
  #map;
  #latitude;
  #longitude;
  #coords;
  sidebarHidden = false;
  constructor() {
    this._getCoords();

    /////////////////////////////////////////////////////////////////////////////////
    // EVENT HANDLERS

    // SIDEBAR
    btnSidebar.addEventListener("click", function () {
      this.sidebarHidden = this.sidebarHidden ? false : true;
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

    document.querySelector(".peak-list__buttons-wrapper").addEventListener(
      "click",
      function (e) {
        const clicked = e.target.closest(".btn--text");
        if (!clicked) return;
        this._displayPeakLists(clicked.dataset.display);
      }.bind(this)
    );

    // SINGLE PEAK LISTS CONTAINER EVENT HANDLERS

    btnBacks.forEach((btnBack) => {
      btnBack.addEventListener(
        "click",
        this._displayContainer.bind(
          this,

          `${btnBack.dataset.container}`
        )
      );
      btnBack.addEventListener("click", this._clearMap.bind(this));
    });

    document.addEventListener(
      "click",
      function (e) {
        const clicked = e.target.closest(".btn-log-trip");
        if (!clicked) return;
        this._displayContainer("new-entry");
        this._displayPeakListCheckboxes(clicked.dataset.listId);
        chooseListSelect.value = clicked.dataset.listId;
        const checkbox = [...gridPeakCheckboxes.querySelectorAll("input")].find(
          (input) => +input.value === +clicked.dataset.mtnId
        );
        checkbox.checked = "true";
      }.bind(this)
    );

    // HISTORY CONTAINER EVENT HANDLERS

    historyEntriesEl.addEventListener(
      "click",
      function (e) {
        const clicked = e.target.closest(".btn");
        if (!clicked) return;
        if (clicked.classList.contains("btn-delete-entry")) {
          if (confirm("Are you sure you want to delete this entry?")) {
            const logID = +clicked.closest(".list-entry").dataset.id;
            currentUser.removeLogEntry(logID);
            this._displayAllHistoryList();
          }
        }
        if (clicked.classList.contains("btn-view-history")) {
          this._displayContainer("single-history");
          this._displaySingleHistory(
            Number(clicked.closest(".list-entry").dataset.id)
          );
        }
      }.bind(this)
    );

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

        const newEntry = new LogEntry(
          new Date(inputDate.value),
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
    this.#latitude = position.coords["latitude"] || 44.0444;
    this.#longitude = position.coords["longitude"] || -71.6684;
    this.#coords = [this.#latitude, this.#longitude];
    this.#map = new L.Map("map", {
      zoomControl: false,
    }).setView(this.#coords, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    L.control
      .zoom({
        position: "bottomright",
      })
      .addTo(this.#map);

    // this.#map.on("click", function (mapEvent) {
    //   console.log(mapEvent);
    // });
  }

  _clearMap() {
    peakListsArr.forEach((list) => list.clearPeaksOnMap());
  }

  _plotListOnMap(peakID) {
    const currentList = peakListsArr.find((peak) => peak.id === peakID);
    this._clearMap();
    this.#map.setView(currentList.center, currentList.zoom);
    this.#map.addLayer(currentList.createMarkerLayer());
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
    }
    this._clearMap();
  }

  _peakListClick(e) {
    // View list button
    const { id } = e.target.closest(".list-entry").dataset;
    if (e.target.closest(".btn-view-list")) {
      this._displaySinglePeakList(id);
    }

    // Save peak list button
    if (e.target.closest(".btn-add-peak-list")) {
      if (!currentUser.savedLists.includes(id)) {
        currentUser.addSavedList(id);
        e.target.textContent = "done";
      } else {
        currentUser.removeSavedList(id);
        e.target.textContent = "post_add";
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
    containerID === "all-peak-lists" && this._displayPeakLists();
    this._displayAllHistoryList();
    containerID === "history" && this._displayAllHistoryList();

    mainNavBtns.forEach((btn) => {
      btn.classList.remove("main-nav__btn--active");
      btn.dataset.container === containerObj.dataset.navId &&
        btn.classList.add("main-nav__btn--active");
    });
  }

  _displayPeakLists(type = "all") {
    peakListsEl.innerHTML = "";
    const listToDisplay =
      type === "saved"
        ? peakListsArr.filter((list) =>
            currentUser.savedLists.includes(list.id)
          )
        : peakListsArr;

    listToDisplay.sort((a, b) =>
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
    listToDisplay.forEach((peakList) => {
      peakListsEl.insertAdjacentHTML(
        "beforeend",
        this._createPeakListHTML(peakList.id)
      );
    });
  }

  _createPeakListHTML(listID) {
    const currentList = getListFromID(listID);
    const html = `<li class="list-entry" data-id="${currentList.id}">
        <button class="btn btn--icon btn-add-peak-list" data-id='${
          currentList.id
        }'>
        <span class="material-icons"> ${
          currentUser.savedLists.includes(currentList.id) ? "done" : "post_add"
        } </span>
      </button>
      <div class="list-entry__info">
        <h2 class="list-entry__label-primary"><strong>${
          currentList.title
        }</strong></h2>
        <span class="list-entry__label-secondary">${
          currentUser.listCounts[currentList.id]
        } of ${currentList.peakCount} Peaks</span>
        ${this._createProgressBarHTML(currentList.id)}
        <button class="btn btn--dark btn-view btn-view-list">VIEW</button>
    </li>`;
    return html;
  }

  _createProgressBarHTML(listID) {
    const currentList = getListFromID(listID);
    const width =
      (currentUser.listCounts[currentList.id] / currentList.data.length) * 100;
    const html = `<div class='progress-bar'><div class='progress-bar__label'>${
      Math.round(width * 10) / 10
    }%</div><div class='progress' style="width:${width}%"></div></div>
      </div>`;
    return html;
  }

  _sortPeakList(listID, sortType = "elevation") {
    const currentPeakListObj = getListFromID(listID);
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

  _displaySinglePeakList(listID) {
    this._displayContainer("single-peak-list");
    const currentPeakObj = getListFromID(listID);
    containerSinglePeakList.querySelector(
      ".container__heading"
    ).textContent = `${currentPeakObj.title}`;
    containerSinglePeakList.querySelector(
      ".peak-list__label-number"
    ).textContent = `${currentUser.listCounts[currentPeakObj.id]} of ${
      currentPeakObj.peakCount
    } Peaks`;
    containerSinglePeakList.querySelector(".wrapper-progress").innerHTML = "";
    containerSinglePeakList
      .querySelector(".wrapper-progress")
      .insertAdjacentHTML("beforeend", this._createProgressBarHTML(listID));
    this._plotListOnMap(listID);
    peakListTableBody.innerHTML = "";
    peakListTableBody.insertAdjacentHTML(
      "beforeend",
      this._createSinglePeakListHTML(listID)
    );
  }

  _createSinglePeakListHTML(listID) {
    const currentList = getListFromID(listID);
    this._sortPeakList(listID, "elevation");
    let peakListHTML = "";
    currentList.data.forEach((peak, i) => {
      let logMatch;
      if (currentUser.logEntries.length) {
        logMatch = currentUser.logEntries.find((entry) =>
          entry.peaks.includes(peak.id)
        );
      }

      const htmlRow = `<tr class="peak-list__table-row ${
        logMatch && "peak-list__table-row--complete"
      }" data-mtn-id="${peak.id}" data-list-id="${peak.id}">
        <td>${i + 1}</td>
        <td style="text-align:left">${peak.name}</td>
        <td>${peak.state}</td>

        <td>${peak.elevFeet.toLocaleString()}</td>
        <td>${
          logMatch
            ? `${logMatch.shortDate}`
            : `<button class='btn btn--text btn-log-trip' data-mtn-id='${peak.id}' data-list-id='${currentList.id}'>LOG TRIP</button>`
        }</td>
      </tr>`;
      peakListHTML += htmlRow;
    });
    return peakListHTML;
  }

  // HISTORY CONTAINER FUNCTIONS

  _displayAllHistoryList() {
    historyEntriesEl.innerHTML = "";
    if (currentUser.logEntries.length) {
      currentUser.sortLogEntries();
      currentUser.logEntries.forEach((entry) => {
        const mtnNames = entry.peaks.map((peakID) => peakMap.get(peakID));
        let mtnStr =
          mtnNames.length > 1
            ? mtnNames.slice(0, -1).join(", ") + " and " + mtnNames.slice(-1)
            : mtnNames[0];

        historyEntriesEl.insertAdjacentHTML(
          "beforeend",
          `<li class="list-entry" data-id="${entry.id}">
              <span class="material-icons"> hiking </span>

              <div class="list-entry__info">
                <h2 class="list-entry__label-primary"><strong>
                  ${entry.longDate} </strong> - ${mtnNames.length} ${
            mtnNames.length > 1 ? "Peaks" : "Peak"
          }
                </h2>
                <span
                  class="list-entry__label-secondary"
                >
                  ${mtnStr}</span
                >
              </div>
              <div class='btn-wrapper flex-center'>
              <button class='btn btn--icon btn-delete-entry'><span class="material-icons">
              delete
              </span></button>
              <button class="btn btn--dark btn-view btn-view-history">VIEW</button>
              </div>
            </li>`
        );
      });
    }
  }

  _displaySingleHistory(logID) {
    singleHistoryTable.innerHTML = "";
    const logObj = currentUser.logEntries.find((entry) => entry.id === logID);
    document.querySelector(".single-history__label-number").textContent = `${
      logObj.peaks.length
    } ${logObj.peaks.length > 1 ? "Peaks" : "Peak"}`;
    document.querySelector(
      ".single-history__heading"
    ).textContent = `${logObj.longDate}`;

    let peaksStr = "";
    logObj.peaks.forEach(
      (peakID) =>
        (peaksStr += `<span style='font-size:1.4rem'>${peakMap.get(
          peakID
        )} - ${elevationMap.get(peakID).toLocaleString()} ft</span>`)
    );
    let ratingHTML = "";
    if (logObj.rating) {
      for (let i = 0; i < logObj.rating; i++) {
        ratingHTML += `<span class="material-icons star-icon--full"> star </span>`;
      }
      for (let i = 0; i < 5 - logObj.rating; i++) {
        ratingHTML += `<span class="material-icons"> star_border </span>`;
      }
    } else {
      ratingHTML = "n/a";
    }

    const historyHTML = ` <tr>
        <th style="width: 40%">Peaks:</th>
        <td style="width: 60%">
          <div class="flex-column">
            ${peaksStr}
          </div>
        </td>
      </tr>
      <tr>
        <th>Distance:</th>
        <td>${logObj.distance ? logObj.distance + ` mi` : "n/a"}</td>
      </tr>
      <tr>
        <th>Elevation Gain:</th>
        <td>${
          logObj.elevation ? logObj.elevation.toLocaleString() + ` ft` : "n/a"
        }</td>
      </tr>
      <tr>
        <th>Time:</th>
        <td>${logObj.time ? logObj.time + ` hrs` : "n/a"}</td>
      </tr>
      <tr>
        <th>Avg. Speed:</th>
        <td>${logObj.avgSpeed ? logObj.avgSpeed + ` mi/hr` : "n/a"}</td>
      </tr>
      <tr>
        <th>Avg. Elevation Gain:</th>
        <td>${
          logObj.avgElevation
            ? logObj.avgElevation.toLocaleString() + ` ft/mi`
            : "n/a"
        } </td>
      </tr>

      <th>Rating</th>
      <td>
        ${ratingHTML}
      </td>
      <tr>
        <th>Notes:</th>
        <td>
          ${logObj.notes ? logObj.notes : "n/a"}
        </td>
      </tr>`;

    singleHistoryTable.insertAdjacentHTML("beforeend", historyHTML);
  }

  // NEW ENTRY CONTAINER FUNCTIONS

  _displayPeakListCheckboxes(listID) {
    gridPeakCheckboxes.classList.remove("hidden");
    gridPeakCheckboxes.innerHTML = "";

    const currentPeakListObj = getListFromID(listID);

    this._sortPeakList(listID, "alphabetical");

    const arrCopy = currentPeakListObj.data.map((peak) => peak);
    const arrFirstHalf = arrCopy.splice(Math.ceil(arrCopy.length / 2));
    const displayArr = [];

    for (const [i, _] of arrCopy.entries()) {
      arrCopy[i] && displayArr.push(arrCopy[i]);
      arrFirstHalf[i] && displayArr.push(arrFirstHalf[i]);
    }

    displayArr.forEach((peak) =>
      gridPeakCheckboxes.insertAdjacentHTML(
        "beforeend",
        `<input type="checkbox" value="${peak.id}"/><label
                  for="title"
                  class="form__label--units"
                  >${peak.name}</label
                >`
      )
    );

    this._plotListOnMap(listID);
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

  _handleStarMouseOut() {
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
