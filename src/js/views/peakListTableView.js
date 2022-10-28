import icons from "../../img/sprite.svg";
import PeakListView from "./peakListView.js";

class PeakListTableView extends PeakListView {
  hash = "#peak-list-table";
  #data;
  _container = document.querySelector(".container-peak-list-table");
  #containerHeading = this._container.querySelector(".container__heading");
  #labelNumber = this._container.querySelector(".peak-list__label-number");
  #progressBarWrapper = this._container.querySelector(
    ".container__heading-progress-wrapper"
  );
  #btnSaveListWrapper = this._container.querySelector(
    ".container__heading-button-wrapper"
  );
  #sortTableSelect = document.querySelector("#sort-table-select");
  #description = document.querySelector(".peak-list-description");
  #tableBody = document.querySelector(".peak-list-table__body");

  // PUBLIC METHODS

  addHandlerRowHover(handler) {
    this.#tableBody.addEventListener("mouseover", function (e) {
      const { peakId } = e.target.closest(".peak-list-table__row").dataset;
      handler(peakId);
    });
  }

  addHandlerLogTrip(handler) {
    document.addEventListener(
      "click",
      function (e) {
        const clicked = e.target.closest(".btn-log-trip");
        if (!clicked) return;
        const { listId, peakId } = clicked.dataset;
        handler(listId, peakId);
      }.bind(this)
    );
  }

  addHandlerSortTable(handler) {
    this.#sortTableSelect.addEventListener(
      "change",
      function (e) {
        const sortType = e.target.value;
        const listID = this.#data.listID;
        handler(listID, sortType);
      }.bind(this)
    );
  }

  render(data) {
    this.#data = data.data;
    this.#sortTableSelect.value = this.#data.sortType;
    this.#containerHeading.innerHTML = `${this.#data.title}`;
    this.#labelNumber.innerHTML = `${this.#data.numCompleted} of ${
      this.#data.peakCount
    } Peaks`;
    this.#progressBarWrapper.innerHTML = this._generateProgressBarMarkup(
      this.#data
    );
    this.#btnSaveListWrapper.innerHTML = this.#generateSaveButtonMarkup();
    this.#description.innerHTML = data.data.description;
    this.#tableBody.innerHTML = this.#generateTableMarkup();
  }

  // PRIVATE METHODS

  #generateTableMarkup() {
    return this.#data.peaks
      .map((peak) => this.#generateTableRowMarkup(peak))
      .join("");
  }

  #generateTableRowMarkup(peak) {
    const markup = `<tr class="peak-list-table__row ${
      peak.completed ? "peak-list-table__row--complete" : ""
    }" data-peak-id="${peak.id}">
        <td><strong>${peak.num}</strong></td>
        <td style="text-align:left">${peak.name}</td>
        <td>${peak.state}</td>

        <td>${peak.elevation.toLocaleString()}</td>
        <td>${
          peak.completed
            ? `${peak.completedDate}`
            : `<button class='btn btn-text btn-log-trip' data-peak-id='${
                peak.id
              }' data-list-id='${this.#data.listID}'>LOG TRIP</button>`
        }</td>
      </tr>`;
    return markup;
  }

  #generateSaveButtonMarkup() {
    const markup = `
      <button class="btn btn-icon btn-save-peak-list" data-list-id="${
        this.#data.listID
      }" aria-label="button to save peak list to saved lists">
        <svg class="btn-icon__icon">
          <use href="${icons}#icon-${
      this.#data.saved ? "remove" : "add"
    }"></use>
        </svg>
      </button>
      <span>${this.#data.saved ? "Remove from" : "Add to"} my lists</span>`;
    return markup;
  }
}

export default new PeakListTableView();
