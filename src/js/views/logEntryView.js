import icons from "../../img/sprite.svg";
import LogView from "./logView.js";

class LogEntryView extends LogView {
  #data;
  _container = document.querySelector(".container-log-entry");
  #logEntryEl = document.querySelector(".log-entry");
  #logEntryLabelNumber = document.querySelector(".log-entry__label-number");
  #logEntryHeading = document.querySelector(".log-entry__heading");
  #btnDeleteWrapper = this._container.querySelector(
    ".container__heading-button-wrapper"
  );
  #peakListGrid = document.querySelector(".log-entry__lists");

  // PUBLIC METHODS

  addHandlerViewMap(handler) {
    this.#logEntryEl.addEventListener("click", function (e) {
      const clicked = e.target.closest(".btn-view--sm");
      if (!clicked) return;
      let { type, id } = clicked.dataset;
      id = type === "log" ? +id : id;
      handler(type, id);
    });
  }

  render(entry) {
    this.#logEntryEl.innerHTML = "";
    this.#logEntryLabelNumber.textContent = `${entry.peaks.length} ${
      entry.peaks.length > 1 ? "Peaks" : "Peak"
    }`;
    this.#logEntryHeading.textContent = `${entry.date.month.alpha} ${entry.date.day}, ${entry.date.year}`;
    this.#btnDeleteWrapper.innerHTML = `${this._generateDeleteButtonMarkup(
      entry,
      "small"
    )}<span>Delete entry</span>`;
    this.#logEntryEl.insertAdjacentHTML(
      "beforeend",
      this.#generateLogEntryMarkup(entry)
    );
  }

  // PRIVATE METHODS

  #generateLogEntryMarkup(entry) {
    const markup = `
      <span class="log-entry__label">Peak Lists:</span>
      <div class="log-entry__lists">${this.#generatePeakListMarkup(entry)}</div>
      <span class="log-entry__label">Peaks:</span>
      <div class="log-entry__peaks" style="grid-template-rows:repeat(${
        entry.peaks.length
      }, max-content)">${this.#generatePeaksMarkup(entry)}</div>
      <span class="log-entry__label">Distance:</span>
      <span>${
        entry.stats.distance ? entry.stats.distance + ` mi` : "n/a"
      }</span>
      <span class="log-entry__label">Elevation Gain:</span>
      <span>${
        entry.stats.elevation
          ? entry.stats.elevation.toLocaleString() + ` ft`
          : "n/a"
      }</span>
      <span class="log-entry__label">Time:</span>
      <span>${entry.stats.time ? entry.stats.time + ` hrs` : "n/a"}</span>
      <span class="log-entry__label">Avg Speed:</span>
      <span>${
        entry.stats.avgSpeed ? entry.stats.avgSpeed + ` mi/hr` : "n/a"
      }</span>
      <span class="log-entry__label">Avg Elevation Gain:</span>
      <span>${
        entry.stats.avgElevation
          ? entry.stats.avgElevation.toLocaleString() + ` ft/mi`
          : "n/a"
      }</span>
      <span class="log-entry__label">Rating:</span>
      <span>${this.#generateRatingMarkup(entry.rating)}</span>
      <span class="log-entry__label">Notes:</span>
      <span>${entry.notes ? entry.notes : "n/a"}</span>`;
    return markup;
  }

  #generateRatingMarkup(rating) {
    let markup = "";
    if (rating) {
      for (let i = 0; i < rating; i++) {
        markup += `<svg class="btn-star__icon btn-star__icon--full"><use href="${icons}#icon-star-solid"></use></svg>`;
      }
      for (let i = 0; i < 5 - rating; i++) {
        markup += `<svg class="btn-star__icon"><use href="${icons}#icon-star"></use></svg>`;
      }
    } else {
      markup = "n/a";
    }
    return markup;
  }

  #generatePeaksMarkup(entry) {
    let markup = "";
    entry.peaks.forEach(
      (peak) =>
        (markup += `<span class='log-entry__peak'>${
          peak.name
        } - ${peak.elevation.toLocaleString()} ft</span>`)
    );
    markup += `<button class='btn btn--green btn-view--sm' data-type='log' data-id='${entry.logID}'>VIEW</button>`;
    return markup;
  }

  #generatePeakListMarkup(entry) {
    let markup = "";
    entry.lists.titles.forEach((title, i) => {
      markup += `<span>${title}</span><button class='btn btn--green btn-view--sm' data-type='list' data-id='${entry.lists.ids[i]}'>VIEW</button>`;
    });
    return markup;
  }
}

export default new LogEntryView();
