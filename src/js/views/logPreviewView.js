import LogView from "./logView.js";

class LogPreviewView extends LogView {
  #data;
  #noEntries;
  _container = document.querySelector(".container-log-preview");
  #logEntriesPreviewEl = document.querySelector(".log-entries-preview");
  #listSelect = document.querySelector("#select-list-log-preview");
  #monthSelect = document.querySelector("#select-month-log-preview");
  #yearSelect = document.querySelector("#select-year-log-preview");
  #allSelects = [this.#listSelect, this.#monthSelect, this.#yearSelect];

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
        const { logId } = clicked.closest(".preview-list__entry").dataset;
        handler(+logId);
      }.bind(this)
    );
  }

  addHandlerLogSelects(handler) {
    this.#allSelects.forEach((select) =>
      select.addEventListener(
        "change",
        function () {
          const listID = this.#listSelect.value;
          const month = this.#monthSelect.value;
          const year = this.#yearSelect.value;
          const currentSelectValues = { listID, month, year };
          handler(currentSelectValues);
        }.bind(this)
      )
    );
  }

  initializeListSelect(data) {
    this.#listSelect.insertAdjacentHTML(
      "beforeend",
      data.map((list) => this.#generateListSelectRowMarkup(list)).join("")
    );
  }

  updateYearSelect(logYears) {
    if (logYears.length) {
      this.#yearSelect.options.length = 0;
      this.#yearSelect.insertAdjacentHTML(
        "beforeend",
        this.#generateYearSelectRowMarkup("all", "All years")
      );
      this.#yearSelect.insertAdjacentHTML(
        "beforeend",
        logYears
          .map((year) => this.#generateYearSelectRowMarkup(year, year))
          .join("")
      );
    }
  }

  render(data) {
    this.#data = data.entries;
    this.#noEntries = data.noEntries;
    this.#logEntriesPreviewEl.innerHTML = "";
    if (this.#data.length) {
      this.#noLogEntries.classList.add("hidden");
      this.#logEntriesPreviewEl.insertAdjacentHTML(
        "beforeend",
        this.#generatePreviewMarkup()
      );
    } else {
      this.#showNoEntriesMessage();
    }
  }

  // PRIVATE METHODS

  #generatePreviewMarkup() {
    return this.#data
      .map((entry) => this.#generateSinglePreviewMarkup(entry))
      .join("");
  }

  #generateSinglePreviewMarkup(entry) {
    const markup = `
    <li class="preview-list__entry" data-log-id="${
      entry.logID
    }" data-list-id="${entry.listID}">
      ${this._generateDeleteButtonMarkup(entry)}
      <div class="preview-list__info">
        <h2 class="preview-list__label-primary">
          <strong>${entry.date.month.alpha} ${entry.date.day}, ${
      entry.date.year
    } </strong> - ${entry.peaks.length} ${
      entry.peaks.length > 1 ? "Peaks" : "Peak"
    }
        </h2>
        <span class="preview-list__label-secondary">${entry.peakString}</span>
      </div>
              
              <button class="btn btn--green btn-view btn-view-log">VIEW</button>
            </li>`;
    return markup;
  }

  #generateListSelectRowMarkup(list) {
    const markup = `<option value="${list.listID}">${list.title}</option>`;
    return markup;
  }

  #generateYearSelectRowMarkup(value, text) {
    const markup = `<option value="${value}">${text}</option>`;
    return markup;
  }

  #showNoEntriesMessage() {
    const message = `
    You haven't added any log entries ${
      this.#noEntries ? "" : "that include peaks from this list"
    } yet.
    Click the button below to log your first entry!
    `;
    this.#noEntriesMessage.innerHTML = message;
    this.#noLogEntries.classList.remove("hidden");
  }
}

export default new LogPreviewView();
