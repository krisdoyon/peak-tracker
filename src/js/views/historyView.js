class HistoryView {
  #historyEntriesEl = document.querySelector(".history-entries-list");
  #singleHistoryTable = document.querySelector(".single-history__table");
  #singleHistoryLabelNumber = document.querySelector(
    ".single-history__label-number"
  );
  #singleHistoryHeading = document.querySelector(".single-history__heading");

  // PUBLIC METHODS

  addHandlerViewSingleHistory(handler) {
    this.#historyEntriesEl.addEventListener(
      "click",
      function (e) {
        const clicked = e.target.closest(".btn-view");
        if (!clicked) return;
        const logID = clicked.closest(".list-entry").dataset.id;

        handler(+logID);
      }.bind(this)
    );
  }

  addHandlerRemoveHistoryEntry(handler) {
    this.#historyEntriesEl.addEventListener("click", function (e) {
      const clicked = e.target.closest(".btn-delete-entry");
      if (!clicked) return;
      if (confirm("Are you sure you want to delete this entry?")) {
        const logID = +clicked.closest(".list-entry").dataset.id;
        handler(logID);
      }
    });
  }

  displayAllHistoryList(logEntries) {
    this.#historyEntriesEl.innerHTML = "";
    if (logEntries.length) {
      logEntries.forEach((entry) => {
        this.#historyEntriesEl.insertAdjacentHTML(
          "beforeend",
          `<li class="list-entry" data-id="${entry.id}">
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
            </li>`
        );
      });
    }
  }

  displaySingleHistory(logEntry) {
    this.#singleHistoryTable.innerHTML = "";
    this.#singleHistoryLabelNumber.textContent = `${logEntry.peaks.length} ${
      logEntry.peaks.length > 1 ? "Peaks" : "Peak"
    }`;
    this.#singleHistoryHeading.textContent = `${logEntry.longDate}`;
    let peaksStr = "";
    logEntry.peaks.forEach(
      (peak) =>
        (peaksStr += `<span style='font-size:1.4rem'>${
          peak.name
        } - ${peak.elevation.toLocaleString()} ft</span>`)
    );
    let ratingHTML = "";
    if (logEntry.rating) {
      for (let i = 0; i < logEntry.rating; i++) {
        ratingHTML += `<span class="material-icons star-icon--full"> star </span>`;
      }
      for (let i = 0; i < 5 - logEntry.rating; i++) {
        ratingHTML += `<span class="material-icons"> star_border </span>`;
      }
    } else {
      ratingHTML = "n/a";
    }

    const historyHTML = ` <tr>
        <th style="width: 40%">Peaks:</th>
        <td style="width: 60%">
          <div class="flex-column">
            ${peaksStr}
          </div>
        </td>
      </tr>
      <tr>
        <th>Distance:</th>
        <td>${logEntry.distance ? logEntry.distance + ` mi` : "n/a"}</td>
      </tr>
      <tr>
        <th>Elevation Gain:</th>
        <td>${
          logEntry.elevation
            ? logEntry.elevation.toLocaleString() + ` ft`
            : "n/a"
        }</td>
      </tr>
      <tr>
        <th>Time:</th>
        <td>${logEntry.time ? logEntry.time + ` hrs` : "n/a"}</td>
      </tr>
      <tr>
        <th>Avg. Speed:</th>
        <td>${logEntry.avgSpeed ? logEntry.avgSpeed + ` mi/hr` : "n/a"}</td>
      </tr>
      <tr>
        <th>Avg. Elevation Gain:</th>
        <td>${
          logEntry.avgElevation
            ? logEntry.avgElevation.toLocaleString() + ` ft/mi`
            : "n/a"
        } </td>
      </tr>

      <th>Rating</th>
      <td>
        ${ratingHTML}
      </td>
      <tr>
        <th>Notes:</th>
        <td>
          ${logEntry.notes ? logEntry.notes : "n/a"}
        </td>
      </tr>`;

    this.#singleHistoryTable.insertAdjacentHTML("beforeend", historyHTML);
  }
}

export default new HistoryView();
