import icons from "../../img/sprite.svg";

class PeakListsView {
  #previewData;
  #tableData;
  #previewType;
  #peakListsPreviewEl = document.querySelector(".preview-peak-lists");
  #singleListContainer = document.querySelector(".container-single-peak-list");
  #btnBack = this.#singleListContainer.querySelector(".btn-back");
  #singleListHeading = this.#singleListContainer.querySelector(
    ".container__heading"
  );
  #singleListLabelNumber = this.#singleListContainer.querySelector(
    ".peak-list__label-number"
  );
  #progressBarWrapper = this.#singleListContainer.querySelector(
    ".heading-progress-wrapper"
  );
  #btnSaveListWrapper = this.#singleListContainer.querySelector(
    ".heading-button-wrapper"
  );
  #sortTableSelect = document.querySelector("#sort-table-select");
  #tableBody = document.querySelector(".peak-list-table__body");
  #peakListBtnsWrapper = document.querySelector(".preview-wrapper");
  #previewBtns = [...this.#peakListBtnsWrapper.querySelectorAll(".btn-text")];
  #noSavedLists = document.querySelector(".no-saved-lists");

  // PUBLIC METHODS

  addHandlerTableRowHover(handler) {
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

  addHandlerSavedListsPreview(handler) {
    this.#peakListsPreviewEl.addEventListener("click", function (e) {
      const clicked = e.target.closest(".btn-save-peak-list");
      if (!clicked) return;
      const { listId } = e.target.closest(".preview-list__entry").dataset;
      handler(listId);
    });
  }

  addHandlerSavedListsTable(handler) {
    this.#btnSaveListWrapper.addEventListener("click", function (e) {
      const clicked = e.target.closest(".btn-save-peak-list");
      if (!clicked) return;
      const listId = clicked.dataset.id;
      handler(listId);
    });
  }

  addHandlerPeakListView(handler) {
    this.#peakListsPreviewEl.addEventListener("click", function (e) {
      const clicked = e.target.closest(".btn-view-list");
      if (!clicked) return;
      const { listId } = e.target.closest(".preview-list__entry").dataset;
      handler(listId);
    });
  }

  addHandlerPeakListPreview(handler) {
    this.#peakListBtnsWrapper.addEventListener(
      "click",
      function (e) {
        const clicked = e.target.closest(".btn-text");
        if (!clicked) return;
        const { previewType } = clicked.dataset;
        handler(previewType);
      }.bind(this)
    );
  }

  addHandlerSortTable(handler) {
    this.#sortTableSelect.addEventListener(
      "change",
      function (e) {
        const sortType = e.target.value;
        const listID = this.#tableData.listID;
        handler(listID, sortType);
      }.bind(this)
    );
  }

  renderPeakListsPreview(data) {
    this.#previewData = data.data;
    this.#previewType = data.previewType;
    this.#setActivePreviewBtn(this.#previewType);
    this.#peakListsPreviewEl.innerHTML = "";
    if (this.#previewData.length) {
      this.#noSavedLists.classList.add("hidden");
      this.#peakListsPreviewEl.insertAdjacentHTML(
        "beforeend",
        this.#generatePreviewMarkup(this.#previewData)
      );
    } else {
      this.#noSavedLists.classList.remove("hidden");
    }
  }

  renderPeakListTable(data) {
    this.#tableData = data;
    this.#singleListHeading.innerHTML = `${this.#tableData.title}`;
    this.#singleListLabelNumber.innerHTML = `${
      this.#tableData.numCompleted
    } of ${this.#tableData.peakCount} Peaks`;
    this.#progressBarWrapper.innerHTML = `${this.#generateProgressBarMarkup(
      this.#tableData
    )}`;
    this.#btnSaveListWrapper.innerHTML = this.#generateSaveButtonMarkup();
    this.#tableBody.innerHTML = "";
    this.#tableBody.insertAdjacentHTML(
      "beforeend",
      this.#generateTableMarkup()
    );
  }

  // PRIVATE METHODS

  #generateTableMarkup() {
    return this.#tableData.peaks
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
              }' data-list-id='${this.#tableData.listID}'>LOG TRIP</button>`
        }</td>
      </tr>`;
    return markup;
  }

  #generatePreviewMarkup() {
    return this.#previewData
      .map((list) => this.#generateSinglePreviewMarkup(list))
      .join("");
  }

  #generateSinglePreviewMarkup(list) {
    const markup = `<li class="preview-list__entry" data-list-id="${
      list.listID
    }">
      <button class="btn btn-icon btn-save-peak-list" data-id='${list.listID}'>
        <svg class="btn-icon__icon">
          <use href="${icons}#icon-${list.saved ? "remove" : "add"}"></use>
        </svg>
      </button>
      <div class="preview-list__info">
        <h2 class="preview-list__label-primary"><strong>${
          list.title
        }</strong></h2>
        <span class="preview-list__label-secondary">${list.numCompleted} of ${
      list.peakCount
    } Peaks</span>
        ${this.#generateProgressBarMarkup(list)}
        <button class="btn btn--green btn-view btn-view-list">VIEW</button>
    </li>`;
    return markup;
  }

  #generateProgressBarMarkup(list) {
    const width = (list.numCompleted / list.peakCount) * 100;
    const markup = `<div class='progress-bar'><div class='progress-bar__label'>${
      Math.round(width * 10) / 10
    }%</div><div class='progress-bar__progress' style="width:${width}%"></div></div>
      </div>`;
    return markup;
  }

  #generateSaveButtonMarkup() {
    const markup = `
      <button class="btn btn-icon btn-save-peak-list" data-id='${
        this.#tableData.listID
      }'>
        <svg class="btn-icon__icon">
          <use href="${icons}#icon-${
      this.#tableData.saved ? "remove" : "add"
    }"></use>
        </svg>
      </button>
      <span>${
        this.#tableData.saved ? "Remove from" : "Add to"
      } my lists</span>`;
    return markup;
  }

  #setActivePreviewBtn() {
    this.#previewBtns.forEach((btn) =>
      btn.classList.remove("btn-text--active")
    );
    this.#previewBtns
      .find((btn) => btn.dataset.previewType === this.#previewType)
      .classList.add("btn-text--active");
  }
}

export default new PeakListsView();
