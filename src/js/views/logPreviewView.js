import LogView from "./logView.js";

class LogPreviewView extends LogView {
  #data;
  #entries;
  #noEntries;
  #curSelectValues;
  #allSelectValues;
  #listSelect;
  #monthSelect;
  #yearSelect;
  hash = "#log-preview";
  _container = document.querySelector(".container-log-preview");
  #previewGrid = document.querySelector(".preview-list--log-entries");
  #selectWrapper = this._container.querySelector(".preview-wrapper");
  #btnAddEntry = this._container.querySelector(".btn-add-entry");
  #noEntriesMessage = this._container.querySelector(".no-data__message");
  #noLogEntries = document.querySelector(".no-log-entries");

  // PUBLIC METHODS

  addHandlerAddEntry(handler) {
    this.#btnAddEntry.addEventListener("click", handler);
  }

  addHandlerShowEntry(handler) {
    this._container.addEventListener(
      "click",
      function (e) {
        const clicked = e.target.closest(".btn-view");
        if (!clicked) return;
        const { logId } = clicked.dataset;
        handler(+logId);
      }.bind(this)
    );
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

  addHandlerPagination(handler) {
    this.#selectWrapper.addEventListener(
      "click",
      function (e) {
        const clicked = e.target.closest(".btn-pagination");
        if (!clicked) return;
        const { page } = clicked.dataset;
        handler(this.#curSelectValues, +page);
      }.bind(this)
    );
  }

  render(data) {
    this.#data = data;
    this.#entries = data.entries;
    this.#noEntries = data.noEntries;
    this.#curSelectValues = data.curSelectValues;
    this.#allSelectValues = data.allSelectValues;
    this.#selectWrapper.innerHTML = this.#generateSelectWrapperMarkup();
    this.#previewGrid.innerHTML = "";
    if (data.entries.length) {
      this.#noLogEntries.classList.add("hidden");
      this.#previewGrid.classList.remove("hidden");
      this.#previewGrid.innerHTML = this.#generatePreviewMarkup();
    } else {
      this.#previewGrid.classList.add("hidden");
      this.#showNoEntriesMessage();
    }
    this.#listSelect = document.querySelector("#select-list-log-preview");
    this.#monthSelect = document.querySelector("#select-month-log-preview");
    this.#yearSelect = document.querySelector("#select-year-log-preview");
    this.#listSelect.value = this.#curSelectValues.listID;
    this.#monthSelect.value = this.#curSelectValues.month;
    this.#yearSelect.value = this.#curSelectValues.year;
  }

  // PRIVATE METHODS

  #generatePreviewMarkup() {
    return this.#entries
      .map((entry) => this.#generateSinglePreviewMarkup(entry))
      .join("");
  }

  #generateSinglePreviewMarkup(entry) {
    const markup = `
      <li class="preview-list__entry">
        ${this._generateDeleteButtonMarkup(entry)}
        <div class="preview-list__info">
          <h2 class="preview-list__label-primary"><strong>${
            entry.date.month.alpha
          } ${entry.date.day}, ${entry.date.year}</strong> - ${
      entry.peaks.length
    } ${entry.peaks.length > 1 ? "Peaks" : "Peak"}
          </h2>
          <span class="preview-list__label-secondary">${entry.peakString}</span>
        </div>
        <button class="btn btn--green btn-view btn-view-log" data-log-id="${
          entry.logID
        }">VIEW</button>
      </li>`;
    return markup;
  }

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

  #generateSelectWrapperMarkup() {
    const curPage = this.#data.page;
    const numPages = this.#data.numPages;

    // First page, other pages
    if (curPage === 1 && numPages > 1) {
      const markup = `
      ${this.#generateSelectMarkup()}
        <button data-page="2" class="btn btn-pagination btn-pagination--next">
          <span>Page 2</span>
        </button>`;
      return markup;
    }

    // Last page, other pages
    if (curPage === numPages && numPages > 1) {
      const markup = `
        <button data-page="${
          numPages - 1
        }" class="btn btn-pagination btn-pagination--prev">
          <span>Page ${numPages - 1}</span>
        </button>
        ${this.#generateSelectMarkup()}`;
      return markup;
    }

    // First page, no other pages
    if (curPage === 1 && numPages === 1) {
      const markup = this.#generateSelectMarkup();
      return markup;
    }

    // Other page
    if (curPage < numPages) {
      const markup = `
      <button data-page="${
        curPage - 1
      }" class="btn btn-pagination btn-pagination--prev">
          <span>Page ${curPage - 1}</span>
        </button>
      ${this.#generateSelectMarkup()}
        <button data-page="${
          curPage + 1
        }" class="btn btn-pagination btn-pagination--next">
          <span>Page ${curPage + 1}</span>
        </button>`;
      return markup;
    }
  }

  #generateSelectMarkup() {
    const markup = `
      <label for="select-list-log-preview">Filter by list:</label>
      <select class="select-list" id="select-list-log-preview">
        <option value="all" selected>All lists</option>
        ${this.#allSelectValues.lists
          .map(this.#generateListSelectRowMarkup)
          .join("")}
      </select>
      <label for="select-month-log-preview">Filter by date:</label>
      <select id="select-month-log-preview">
        <option value="all" selected>All Months</option>
        ${this.#allSelectValues.months
          .map(this.#generateMonthSelectRowMarkup)
          .join("")}
      </select>
      <select id="select-year-log-preview">
        <option value="all" selected>All years</option>
        ${this.#allSelectValues.years
          .map(this.#generateYearSelectRowMarkup)
          .join("")}
      </select>`;
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

export default new LogPreviewView();
