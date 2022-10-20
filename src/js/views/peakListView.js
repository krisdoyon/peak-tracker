class PeakListsView {
  #previewData;
  #tableData;
  #previewType;
  #peakListsEl = document.querySelector(".peak-lists");
  #singleListContainer = document.querySelector(".container-single-peak-list");
  #singleListHeading = this.#singleListContainer.querySelector(
    ".container__heading"
  );
  #singleListNumberLabel = this.#singleListContainer.querySelector(
    ".peak-list__label-number"
  );
  #singleListProgressWrapper =
    this.#singleListContainer.querySelector(".wrapper-progress");
  #peakListTableBody = document.querySelector(".peak-list__table-body");
  #btnBack = this.#singleListContainer.querySelector(".btn-back");
  #peakListBtnsWrapper = document.querySelector(".peak-list__buttons-wrapper");
  #previewBtns = [...this.#peakListBtnsWrapper.querySelectorAll(".btn-text")];
  #noSavedLists = document.querySelector(".no-saved-lists");

  // PUBLIC METHODS

  addHandlerLogTrip(handler) {
    document.addEventListener(
      "click",
      function (e) {
        const clicked = e.target.closest(".btn-log-trip");
        if (!clicked) return;
        const { listId, mtnId } = clicked.dataset;
        handler(listId, mtnId);
      }.bind(this)
    );
  }

  addHandlerSavedLists(handler) {
    this.#peakListsEl.addEventListener("click", function (e) {
      const clicked = e.target.closest(".btn-add-peak-list");
      if (!clicked) return;
      const { listId } = e.target.closest(".list-entry").dataset;
      handler(listId);
    });
  }

  addHandlerPeakListView(handler) {
    this.#peakListsEl.addEventListener("click", function (e) {
      const clicked = e.target.closest(".btn-view-list");
      if (!clicked) return;
      const { listId } = e.target.closest(".list-entry").dataset;
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

  renderPeakListsPreview(data) {
    this.#previewData = data.data;
    this.#previewType = data.previewType;
    this.#setActivePreviewBtn(this.#previewType);
    this.#peakListsEl.innerHTML = "";
    if (this.#previewData.length) {
      this.#noSavedLists.classList.add("hidden");
      this.#peakListsEl.insertAdjacentHTML(
        "beforeend",
        this.#generatePreviewMarkup(this.#previewData)
      );
    } else {
      this.#noSavedLists.classList.remove("hidden");
    }
  }

  renderPeakListTable(data) {
    this.#tableData = data;
    this.#singleListHeading.textContent = `${this.#tableData.title}`;
    this.#singleListNumberLabel.textContent = `${
      this.#tableData.numCompleted
    } of ${this.#tableData.peakCount} Peaks`;
    this.#singleListProgressWrapper.innerHTML = "";
    this.#singleListProgressWrapper.insertAdjacentHTML(
      "beforeend",
      this.#generateProgressBarMarkup(this.#tableData)
    );
    this.#peakListTableBody.innerHTML = "";
    this.#peakListTableBody.insertAdjacentHTML(
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
    const markup = `<tr class="peak-list__table-row ${
      peak.completed && "peak-list__table-row--complete"
    }" data-mtn-id="${peak.id}" data-list-id="${peak.id}">
        <td>${peak.num}</td>
        <td style="text-align:left">${peak.name}</td>
        <td>${peak.state}</td>

        <td>${peak.elevation.toLocaleString()}</td>
        <td>${
          peak.completed
            ? `${peak.completedDate}`
            : `<button class='btn btn-text btn-log-trip' data-mtn-id='${
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
    const markup = `<li class="list-entry" data-list-id="${list.listID}">
        <button class="btn btn-icon btn-add-peak-list" data-id='${list.listID}'>
        <span class="material-icons"> ${
          list.saved ? "remove_circle_outline" : "add_circle"
        } </span>
      </button>
      <div class="list-entry__info">
        <h2 class="list-entry__label-primary"><strong>${
          list.title
        }</strong></h2>
        <span class="list-entry__label-secondary">${list.numCompleted} of ${
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
    }%</div><div class='progress' style="width:${width}%"></div></div>
      </div>`;
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
