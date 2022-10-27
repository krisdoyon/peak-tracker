import View from "./view.js";

class StatsView extends View {
  hash = "#stats";
  _navBtn = document.querySelector("#nav-btn-stats");
  _container = document.querySelector(".container-stats");
  #data;
  #allSelectValues;
  #curSelectValues;
  #noEntries;
  #statsGrid = document.querySelector(".stats-grid");
  #selectWrapper = this._container.querySelector(".preview-wrapper");
  #listSelect;
  #monthSelect;
  #yearSelect;
  #btnAddEntry = this._container.querySelector(".btn-add-entry");
  #noEntriesMessage = this._container.querySelector(".no-data__message");
  #noLogEntries = document.querySelector(".no-stats");

  // PUBLIC METHODS

  addHandlerAddEntry(handler) {
    this.#btnAddEntry.addEventListener("click", handler);
  }

  addHandlerLogSelects(handler) {
    this.#selectWrapper.addEventListener(
      "change",
      function () {
        const listID = this.#listSelect.value;
        const month = this.#monthSelect.value;
        const year = this.#yearSelect.value;
        const currentSelectValues = { listID, month, year };
        handler(currentSelectValues);
      }.bind(this)
    );
  }

  render(data) {
    this.#data = data.data;
    this.#allSelectValues = data.allSelectValues;
    this.#curSelectValues = data.curSelectValues;
    this.#noEntries = data.noEntries;
    this.#statsGrid.innerHTML = "";
    if (data.data.numberEntries > 0) {
      this.#statsGrid.classList.remove("hidden");
      this.#noLogEntries.classList.add("hidden");
      this.#statsGrid.insertAdjacentHTML(
        "beforeend",
        this.#generateStatsMarkup()
      );
    } else {
      this.#statsGrid.classList.add("hidden");
      this.#showNoEntriesMessage();
    }
    this.#selectWrapper.innerHTML = this.#generateSelectMarkup();
    this.#listSelect = document.querySelector("#select-list-stats");
    this.#monthSelect = document.querySelector("#select-month-stats");
    this.#yearSelect = document.querySelector("#select-year-stats");
    this.#listSelect.value = this.#curSelectValues.listID;
    this.#monthSelect.value = this.#curSelectValues.month;
    this.#yearSelect.value = this.#curSelectValues.year;
  }

  // PRIVATE METHODS

  #generateListSelectRowMarkup(list) {
    const markup = `<option value="${list.listID}">${list.title}</option>`;
    return markup;
  }

  #generateMonthSelectRowMarkup(month) {
    const markup = `<option value="${month.numeric}">${month.alpha}</option>`;
    return markup;
  }

  #generateYearSelectRowMarkup(year) {
    const markup = `<option value="${year}">${year}</option>`;
    return markup;
  }

  #generateSelectMarkup() {
    const markup = `
      <label for="select-list-stats">Filter by list:</label>
      <select class="select-list" id="select-list-stats">
        <option value="all" selected>All lists</option>
        ${this.#allSelectValues.lists
          .map(this.#generateListSelectRowMarkup)
          .join("")}
      </select>
      <label for="select-month-stats">Filter by date:</label>
      <select id="select-month-stats">
        <option value="all" selected>All Months</option>
        ${this.#allSelectValues.months
          .map(this.#generateMonthSelectRowMarkup)
          .join("")}
      </select>
      <select id="select-year-stats">
        <option value="all" selected>All years</option>
        ${this.#allSelectValues.years
          .map(this.#generateYearSelectRowMarkup)
          .join("")}
      </select>`;
    return markup;
  }

  #generateStatsMarkup() {
    const markup = `
      <span class="stats-grid__label">Number of Log Entries:</span>
      <span>${this.#data.numberEntries} ${
      this.#data.numberEntries === 1 ? "entry" : "entries"
    }</span>
      <span class="stats-grid__label">Total Completed Peaks:</span>
      <span>${this.#data.numberPeaks} ${
      this.#data.numberPeaks === 1 ? "peak" : "peaks"
    }</span>
      <span class="stats-grid__label">Total Distance:</span>
      <span>${
        this.#data.totalDistance ? `${this.#data.totalDistance} mi` : "n/a"
      }</span>
      <span class="stats-grid__label">Total Elevation Gain:</span>
      <span>${
        this.#data.totalElevation
          ? `${this.#data.totalElevation.toLocaleString()} ft`
          : "n/a"
      } </span>
      <span class="stats-grid__label">Total Time:</span>
      <span>${
        this.#data.totalTime ? `${this.#data.totalTime} hrs` : "n/a"
      } </span>`;
    return markup;
  }

  #showNoEntriesMessage() {
    const message = `
    You haven't added any log entries ${
      this.#noEntries ? "yet" : "that match the selected filters"
    }. ${this.#noEntries ? "Click" : "Adjust the filters or click"}
     the button below to log ${this.#noEntries ? "your first" : "a new"} entry!
    `;
    this.#noEntriesMessage.innerHTML = message;
    this.#noLogEntries.classList.remove("hidden");
  }
}

export default new StatsView();
