class PeakListsView {
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
  #previewBtns = [...this.#peakListBtnsWrapper.querySelectorAll(".btn--text")];

  // PUBLIC METHODS

  addHandlerLogTrip(handler) {
    document.addEventListener(
      "click",
      function (e) {
        const clicked = e.target.closest(".btn-log-trip");
        if (!clicked) return;
        const listID = clicked.dataset.listId;
        const mtnID = clicked.dataset.mtnId;
        handler(listID, mtnID);
      }.bind(this)
    );
  }

  addHandlerSaveList(handler) {
    this.#peakListsEl.addEventListener("click", function (e) {
      const clicked = e.target.closest(".btn-add-peak-list");
      if (!clicked) return;
      handler(clicked.dataset.id);
    });
  }

  addPeakListViewHandler(handler) {
    this.#peakListsEl.addEventListener("click", function (e) {
      const listID = e.target.closest(".list-entry").dataset.id;
      const clicked = e.target.closest(".btn-view-list");
      if (!clicked) return;
      handler(listID);
    });
  }

  addHandlerBtnsWrapper(handler) {
    this.#peakListBtnsWrapper.addEventListener(
      "click",
      function (e) {
        const clicked = e.target.closest(".btn--text");
        if (!clicked) return;
        const type = clicked.dataset.display;
        handler(type);
      }.bind(this)
    );
  }

  displayPeakListsPreview(listArr, type, savedLists, listCounts) {
    this.#setActivePreviewBtn(type);
    this.#peakListsEl.innerHTML = "";
    listArr.forEach((list) => {
      this.#peakListsEl.insertAdjacentHTML(
        "beforeend",
        this.#generatePreviewMarkup(list, savedLists, listCounts)
      );
    });
  }

  displaySinglePeakList(list, listCounts, logEntries) {
    this.#singleListHeading.textContent = `${list.title}`;
    this.#singleListNumberLabel.textContent = `${listCounts[list.id]} of ${
      list.peakCount
    } Peaks`;
    this.#singleListProgressWrapper.innerHTML = "";
    this.#singleListProgressWrapper.insertAdjacentHTML(
      "beforeend",
      this.#generateProgressBarHTML(list, listCounts)
    );
    this.#peakListTableBody.innerHTML = "";
    this.#peakListTableBody.insertAdjacentHTML(
      "beforeend",
      this.#generateSinglePeakListHTML(list, logEntries)
    );
  }

  // PRIVATE METHODS

  #setActivePreviewBtn(type) {
    this.#previewBtns.forEach((btn) => btn.classList.remove("btn--active"));
    const activeBtn = this.#previewBtns.find(
      (btn) => btn.dataset.display === type
    );
    activeBtn.classList.add("btn--active");
  }

  #generateSinglePeakListHTML(list, logEntries) {
    let peakListHTML = "";
    list.data.forEach((peak, i) => {
      let logMatch;
      if (logEntries.length) {
        logMatch = logEntries.find((entry) =>
          entry.peaks.some((peakObj) => peakObj.id === peak.id)
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

  #generatePreviewMarkup(list, savedLists, listCounts) {
    const markup = `<li class="list-entry" data-id="${list.id}">
        <button class="btn btn--icon btn-add-peak-list" data-id='${list.id}'>
        <span class="material-icons"> ${
          savedLists.includes(list.id) ? "remove_circle_outline" : "add_circle"
        } </span>
      </button>
      <div class="list-entry__info">
        <h2 class="list-entry__label-primary"><strong>${
          list.title
        }</strong></h2>
        <span class="list-entry__label-secondary">${listCounts[list.id]} of ${
      list.peakCount
    } Peaks</span>
        ${this.#generateProgressBarHTML(list, listCounts)}
        <button class="btn btn--dark btn-view btn-view-list">VIEW</button>
    </li>`;
    return markup;
  }

  #generateProgressBarHTML(list, listCounts) {
    const width = (listCounts[list.id] / list.data.length) * 100;
    const html = `<div class='progress-bar'><div class='progress-bar__label'>${
      Math.round(width * 10) / 10
    }%</div><div class='progress' style="width:${width}%"></div></div>
      </div>`;
    return html;
  }
}

export default new PeakListsView();
