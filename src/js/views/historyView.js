class HistoryView {
  #data;
  #historyEntriesEl = document.querySelector(".history-entries-list");
  #singleHistoryTable = document.querySelector(".single-history__table");
  #singleHistoryLabelNumber = document.querySelector(
    ".single-history__label-number"
  );
  #singleHistoryHeading = document.querySelector(".single-history__heading");

  // PUBLIC METHODS

  addHandlerShowEntry(handler) {
    this.#historyEntriesEl.addEventListener(
      "click",
      function (e) {
        const clicked = e.target.closest(".btn-view");
        if (!clicked) return;
        const { logId, listId } = clicked.closest(".list-entry").dataset;
        handler(+logId, listId);
      }.bind(this)
    );
  }

  addHandlerDeleteEntry(handler) {
    this.#historyEntriesEl.addEventListener("click", function (e) {
      const clicked = e.target.closest(".btn-delete-entry");
      if (!clicked) return;
      if (confirm("Are you sure you want to delete this entry?")) {
        const { logId } = clicked.closest(".list-entry").dataset;
        handler(+logId);
      }
    });
  }

  renderAllHistory(data) {
    this.#data = data;
    this.#historyEntriesEl.innerHTML = "";
    if (this.#data.length) {
      this.#historyEntriesEl.insertAdjacentHTML(
        "beforeend",
        this.#generatePreviewMarkup()
      );
    }
  }

  renderHistoryEntry(entry) {
    this.#singleHistoryTable.innerHTML = "";
    this.#singleHistoryLabelNumber.textContent = `${entry.peaks.length} ${
      entry.peaks.length > 1 ? "Peaks" : "Peak"
    }`;
    this.#singleHistoryHeading.textContent = `${entry.longDate}`;
    this.#singleHistoryTable.insertAdjacentHTML(
      "beforeend",
      this.#generateHistoryTableMarkup(entry)
    );
  }

  // PRIVATE METHODS

  #generateHistoryTableMarkup(entry) {
    let peaksStr = "";
    entry.peaks.forEach(
      (peak) =>
        (peaksStr += `<span style='font-size:1.4rem'>${
          peak.name
        } - ${peak.elevation.toLocaleString()} ft</span>`)
    );
    let ratingMarkup = "";
    if (entry.rating) {
      for (let i = 0; i < entry.rating; i++) {
        ratingMarkup += `<span class="material-icons star-icon--full"> star </span>`;
      }
      for (let i = 0; i < 5 - entry.rating; i++) {
        ratingMarkup += `<span class="material-icons"> star_border </span>`;
      }
    } else {
      ratingMarkup = "n/a";
    }
    const markup = ` <tr>
        <th style="width: 40%">Peaks:</th>
        <td style="width: 60%">
          <div class="flex-column">
            ${peaksStr}
          </div>
        </td>
      </tr>
      <tr>
        <th>Distance:</th>
        <td>${entry.distance ? entry.distance + ` mi` : "n/a"}</td>
      </tr>
      <tr>
        <th>Elevation Gain:</th>
        <td>${
          entry.elevation ? entry.elevation.toLocaleString() + ` ft` : "n/a"
        }</td>
      </tr>
      <tr>
        <th>Time:</th>
        <td>${entry.time ? entry.time + ` hrs` : "n/a"}</td>
      </tr>
      <tr>
        <th>Avg. Speed:</th>
        <td>${entry.avgSpeed ? entry.avgSpeed + ` mi/hr` : "n/a"}</td>
      </tr>
      <tr>
        <th>Avg. Elevation Gain:</th>
        <td>${
          entry.avgElevation
            ? entry.avgElevation.toLocaleString() + ` ft/mi`
            : "n/a"
        } </td>
      </tr>

      <th>Rating</th>
      <td>
        ${ratingMarkup}
      </td>
      <tr>
        <th>Notes:</th>
        <td>
          ${entry.notes ? entry.notes : "n/a"}
        </td>
      </tr>`;
    return markup;
  }

  #generatePreviewMarkup() {
    return this.#data
      .map((entry) => this.#generateSinglePreviewMarkup(entry))
      .join("");
  }

  #generateSinglePreviewMarkup(entry) {
    const markup = `<li class="list-entry" data-log-id="${
      entry.logID
    }" data-list-id="${entry.listID}">
              <button class='btn btn--icon btn-delete-entry'><span class="material-icons">
              delete
              </span></button>

              <div class="list-entry__info">
                <h2 class="list-entry__label-primary"><strong>
                  ${entry.longDate} </strong> - ${entry.peaks.length} ${
      entry.peaks.length > 1 ? "Peaks" : "Peak"
    }
                </h2>
                <span
                  class="list-entry__label-secondary"
                >
                  ${entry.mtnStr}</span
                >
              </div>
              
              <button class="btn btn--dark btn-view btn-view-history">VIEW</button>
            </li>`;
    return markup;
  }
}

export default new HistoryView();
