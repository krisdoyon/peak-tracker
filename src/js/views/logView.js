import icons from "url:../../img/sprite.svg";

class LogView {
  #data;
  #logEntriesPreviewEl = document.querySelector(".log-entries-preview");
  #logEntryEl = document.querySelector(".log-entry");
  #logEntryLabelNumber = document.querySelector(".log-entry__label-number");
  #logEntryHeading = document.querySelector(".log-entry__heading");
  #btnAddEntry = document
    .querySelector(".container-log-preview")
    .querySelector(".btn-add-entry");
  #noLogEntries = document.querySelector(".no-log-entries");

  // PUBLIC METHODS

  addHandlerAddEntry(handler) {
    this.#btnAddEntry.addEventListener("click", handler);
  }

  addHandlerShowEntry(handler) {
    this.#logEntriesPreviewEl.addEventListener(
      "click",
      function (e) {
        const clicked = e.target.closest(".btn-view");
        if (!clicked) return;
        const { logId, listId } = clicked.closest(
          ".preview-list__entry"
        ).dataset;
        handler(+logId, listId);
      }.bind(this)
    );
  }

  addHandlerDeleteEntry(handler) {
    this.#logEntriesPreviewEl.addEventListener("click", function (e) {
      const clicked = e.target.closest(".btn-delete-entry");
      if (!clicked) return;
      if (confirm("Are you sure you want to delete this entry?")) {
        const { logId } = clicked.closest(".preview-list__entry").dataset;
        handler(+logId);
      }
    });
  }

  renderLogPreview(data) {
    this.#data = data;
    this.#logEntriesPreviewEl.innerHTML = "";
    if (this.#data.length) {
      this.#noLogEntries.classList.add("hidden");
      this.#logEntriesPreviewEl.insertAdjacentHTML(
        "beforeend",
        this.#generatePreviewMarkup()
      );
    } else {
      this.#noLogEntries.classList.remove("hidden");
    }
  }

  renderLogEntry(entry) {
    this.#logEntryEl.innerHTML = "";
    this.#logEntryLabelNumber.textContent = `${entry.peaks.length} ${
      entry.peaks.length > 1 ? "Peaks" : "Peak"
    }`;
    this.#logEntryHeading.textContent = `${entry.longDate}`;
    this.#logEntryEl.insertAdjacentHTML(
      "beforeend",
      this.#generateLogEntryMarkup(entry)
    );
  }

  // PRIVATE METHODS

  #generateLogEntryMarkup(entry) {
    let peaksStr = "";
    entry.peaks.forEach(
      (peak) =>
        (peaksStr += `<span class='log-entry__peak'>${
          peak.name
        } - ${peak.elevation.toLocaleString()} ft</span>`)
    );
    let ratingMarkup = "";
    if (entry.rating) {
      for (let i = 0; i < entry.rating; i++) {
        ratingMarkup += `<svg class="btn-star__icon btn-star__icon--full"><use href="${icons}#icon-star-solid"></use></svg>`;
      }
      for (let i = 0; i < 5 - entry.rating; i++) {
        ratingMarkup += `<svg class="btn-star__icon"><use href="${icons}#icon-star"></use></svg>`;
      }
    } else {
      ratingMarkup = "n/a";
    }
    const markup = `
      <span class="log-entry__label">Peak List:</span>
      <span>${entry.listTitle}</span>
      <span class="log-entry__label">Peaks:</span>
      <div class="log-entry__peaks">${peaksStr}</div>
      <span class="log-entry__label">Distance:</span>
      <span>${entry.distance ? entry.distance + ` mi` : "n/a"}</span>
      <span class="log-entry__label">Elevation Gain:</span>
      <span>${
        entry.elevation ? entry.elevation.toLocaleString() + ` ft` : "n/a"
      }</span>
      <span class="log-entry__label">Time:</span>
      <span>${entry.time ? entry.time + ` hrs` : "n/a"}</span>
      <span class="log-entry__label">Avg Speed:</span>
      <span>${entry.avgSpeed ? entry.avgSpeed + ` mi/hr` : "n/a"}</span>
      <span class="log-entry__label">Avg Elevation Gain:</span>
      <span>${
        entry.avgElevation
          ? entry.avgElevation.toLocaleString() + ` ft/mi`
          : "n/a"
      }</span>
      <span class="log-entry__label">Rating:</span>
      <span>${ratingMarkup}</span>
      <span class="log-entry__label">Notes:</span>
      <span>${entry.notes ? entry.notes : "n/a"}</span>`;
    return markup;
  }

  #generatePreviewMarkup() {
    return this.#data
      .map((entry) => this.#generateSinglePreviewMarkup(entry))
      .join("");
  }

  #generateSinglePreviewMarkup(entry) {
    const markup = `<li class="preview-list__entry" data-log-id="${
      entry.logID
    }" data-list-id="${entry.listID}">
              <button class='btn btn-icon btn-delete-entry'>
                <svg class="btn-icon__icon">
                  <use href="${icons}#icon-trash"></use></svg></button>

              <div class="preview-list__info">
                <h2 class="preview-list__label-primary"><strong>
                  ${entry.longDate} </strong> - ${entry.peaks.length} ${
      entry.peaks.length > 1 ? "Peaks" : "Peak"
    }
                </h2>
                <span
                  class="preview-list__label-secondary"
                >
                  ${entry.mtnStr}</span
                >
              </div>
              
              <button class="btn btn--green btn-view btn-view-log">VIEW</button>
            </li>`;
    return markup;
  }
}

export default new LogView();
