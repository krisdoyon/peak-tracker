import LogView from "./logView.js";

class LogPreviewView extends LogView {
  #data;
  #noEntries;
  _container = document.querySelector(".container-log-preview");
  #logEntriesPreviewEl = document.querySelector(".log-entries-preview");
  #chooseListSelect = document.querySelector("#choose-list-log-preview");
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

  addHandlerLogSelect(handler) {
    this.#chooseListSelect.addEventListener("change", function (e) {
      const listID = e.target.value;
      handler(listID);
    });
  }

  initializeListSelect(data) {
    this.#chooseListSelect.insertAdjacentHTML(
      "beforeend",
      data.map((list) => this.#generateSelectRowMarkup(list)).join("")
    );
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
          <strong>${entry.longDate} </strong> - ${entry.peaks.length} ${
      entry.peaks.length > 1 ? "Peaks" : "Peak"
    }
        </h2>
        <span class="preview-list__label-secondary">${entry.peakString}</span>
      </div>
              
              <button class="btn btn--green btn-view btn-view-log">VIEW</button>
            </li>`;
    return markup;
  }

  #generateSelectRowMarkup(list) {
    const markup = `<option value="${list.listID}">${list.title}</option>`;
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
