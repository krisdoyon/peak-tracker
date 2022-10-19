class PeakListsView {
  _peakListsEl = document.querySelector(".peak-lists");
  _singleListContainer = document.querySelector(".container-single-peak-list");
  _singleListHeading = this._singleListContainer.querySelector(
    ".container__heading"
  );
  _singleListNumberLabel = this._singleListContainer.querySelector(
    ".peak-list__label-number"
  );
  _singleListProgressWrapper =
    this._singleListContainer.querySelector(".wrapper-progress");
  _peakListTableBody = document.querySelector(".peak-list__table-body");
  _btnBack = this._singleListContainer.querySelector(".btn-back");
  _peaklistBtnsWrapper = document.querySelector(".peak-list__buttons-wrapper");

  // PUBLIC METHODS

  addHandlerLogTrip(handler) {
    document.addEventListener(
      "click",
      function (e) {
        const clicked = e.target.closest(".btn-log-trip");
        if (!clicked) return;
        // this._chooseListSelect.value = clicked.dataset.listId;
        const listID = clicked.dataset.listId;
        const mtnID = clicked.dataset.mtnId;
        handler(listID, mtnID);
      }.bind(this)
    );
  }

  addPeakListViewHandler(handler) {
    this._peakListsEl.addEventListener("click", function (e) {
      const listID = e.target.closest(".list-entry").dataset.id;
      const clicked = e.target.closest(".btn-view-list");
      if (!clicked) return;
      handler(listID);
    });
  }

  addHandlerBtnBack(handler) {
    this._btnBack.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn-back");
      if (!btn) return;
      handler(btn.dataset.container);
    });
  }

  displayPeakLists(listArr, user) {
    this._peakListsEl.innerHTML = "";
    listArr.forEach((list) => {
      this._peakListsEl.insertAdjacentHTML(
        "beforeend",
        this._generatePreviewMarkup(list, user)
      );
    });
  }

  displaySinglePeakList(list, user) {
    this._singleListHeading.textContent = `${list.title}`;
    this._singleListNumberLabel.textContent = `${user.listCounts[list.id]} of ${
      list.peakCount
    } Peaks`;
    this._singleListProgressWrapper.innerHTML = "";
    this._singleListProgressWrapper.insertAdjacentHTML(
      "beforeend",
      this._generateProgressBarHTML(list, user)
    );
    this._peakListTableBody.innerHTML = "";
    this._peakListTableBody.insertAdjacentHTML(
      "beforeend",
      this._createSinglePeakListHTML(list, user)
    );
  }

  // PRIVATE METHODS

  // TODO
  // FOR SWITCHING BETWEEN DISPLAYING ALL LISTS AND SAVED USER LISTS

  _addHandlerBtnsWrapper() {
    this._peakListBtnsWrapper.addEventListener(
      "click",
      function (e) {
        const clicked = e.target.closest(".btn--text");
        if (!clicked) return;
        this._displayPeakLists(clicked.dataset.display);
      }.bind(this)
    );
  }

  _createSinglePeakListHTML(list, user) {
    let peakListHTML = "";
    list.data.forEach((peak, i) => {
      let logMatch;
      if (user.logEntries.length) {
        logMatch = user.logEntries.find((entry) =>
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
            : `<button class='btn btn--text btn-log-trip' data-mtn-id='${peak.id}' data-list-id='${list.id}'>LOG TRIP</button>`
        }</td>
      </tr>`;
      peakListHTML += htmlRow;
    });
    return peakListHTML;
  }

  _generatePreviewMarkup(list, user) {
    const markup = `<li class="list-entry" data-id="${list.id}">
        <button class="btn btn--icon btn-add-peak-list" data-id='${list.id}'>
        <span class="material-icons"> ${
          user.savedLists.includes(list.id) ? "done" : "post_add"
        } </span>
      </button>
      <div class="list-entry__info">
        <h2 class="list-entry__label-primary"><strong>${
          list.title
        }</strong></h2>
        <span class="list-entry__label-secondary">${
          user.listCounts[list.id]
        } of ${list.peakCount} Peaks</span>
        ${this._generateProgressBarHTML(list, user)}
        <button class="btn btn--dark btn-view btn-view-list">VIEW</button>
    </li>`;
    return markup;
  }

  _generateProgressBarHTML(list, user) {
    const width = (user.listCounts[list.id] / list.data.length) * 100;
    const html = `<div class='progress-bar'><div class='progress-bar__label'>${
      Math.round(width * 10) / 10
    }%</div><div class='progress' style="width:${width}%"></div></div>
      </div>`;
    return html;
  }
}

export default new PeakListsView();
