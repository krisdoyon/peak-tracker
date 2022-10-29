import icons from "../../img/sprite.svg";
import LogView from "./logView.js";

class LogEntryView extends LogView {
  #entry;
  hash = "#log-entry";
  _container = document.querySelector(".container-log-entry");
  #logEntryEl = document.querySelector(".log-entry");
  #logEntryLabelNumber = document.querySelector(".log-entry__label-number");
  #logEntryHeading = document.querySelector(".log-entry__heading");
  #btnDeleteWrapper = this._container.querySelector(
    ".container__heading-button-wrapper"
  );

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
    this.#entry = entry;
    this.#logEntryEl.innerHTML = "";
    this.#logEntryLabelNumber.innerHTML = `${entry.peaks.length} ${
      entry.peaks.length > 1 ? "Peaks" : "Peak"
    }`;
    this.#logEntryHeading.innerHTML = `${entry.date.month.alpha} ${entry.date.day}, ${entry.date.year}`;
    this.#btnDeleteWrapper.innerHTML = `${this._generateDeleteButtonMarkup(
      entry,
      "small"
    )}<span>Delete entry</span>`;
    this.#logEntryEl.insertAdjacentHTML(
      "beforeend",
      this.#generateLogEntryMarkup()
    );
  }

  // PRIVATE METHODS

  #generateLogEntryMarkup() {
    const markup = `
      <span class="log-entry__label">Peak Lists:</span>
      <div class="log-entry__lists">${this.#generatePeakListMarkup()}</div>
      <span class="log-entry__label">Peaks:</span>
      <div class="log-entry__peaks" style="grid-template-rows:repeat(${
        this.#entry.peaks.length
      }, max-content)">${this.#generatePeaksMarkup()}</div>
      <span class="log-entry__label">Distance:</span>
      <span>${
        this.#entry.stats.distance ? this.#entry.stats.distance + ` mi` : "n/a"
      }</span>
      <span class="log-entry__label">Elevation:</span>
      <span>${
        this.#entry.stats.elevation
          ? this.#entry.stats.elevation.toLocaleString() + ` ft`
          : "n/a"
      }</span>
      <span class="log-entry__label">Time:</span>
      <span>${
        this.#entry.stats.time ? this.#entry.stats.time + ` hrs` : "n/a"
      }</span>
      <span class="log-entry__label">Avg Speed:</span>
      <span>${
        this.#entry.stats.avgSpeed
          ? this.#entry.stats.avgSpeed + ` mi/hr`
          : "n/a"
      }</span>
      <span class="log-entry__label">Avg Elevation:</span>
      <span>${
        this.#entry.stats.avgElevation
          ? this.#entry.stats.avgElevation.toLocaleString() + ` ft/mi`
          : "n/a"
      }</span>
      <span class="log-entry__label">Rating:</span>
      <span>${this.#generateRatingMarkup()}</span>
      <span class="log-entry__label">Notes:</span>
      <span>${this.#entry.notes ? this.#entry.notes : "n/a"}</span>`;
    return markup;
  }

  #generateRatingMarkup() {
    let markup = "";
    if (this.#entry.rating) {
      for (let i = 0; i < this.#entry.rating; i++) {
        markup += `<svg class="btn-star__icon btn-star__icon--full"><use href="${icons}#icon-star-solid"></use></svg>`;
      }
      for (let i = 0; i < 5 - this.#entry.rating; i++) {
        markup += `<svg class="btn-star__icon"><use href="${icons}#icon-star"></use></svg>`;
      }
    } else {
      markup = "n/a";
    }
    return markup;
  }

  #generatePeaksMarkup() {
    let markup = "";
    this.#entry.peaks.forEach(
      (peak) =>
        (markup += `<span class='log-entry__peak'>${
          peak.name
        } - ${peak.elevation.toLocaleString()} ft</span>`)
    );
    markup += `<button class='btn btn--green btn-view--sm' data-type='log' data-id='${
      this.#entry.logID
    }'>VIEW</button>`;
    return markup;
  }

  #generatePeakListMarkup() {
    let markup = "";
    this.#entry.lists.forEach((list) => {
      markup += `<span>${list.title}</span><button class='btn btn--green btn-view--sm' data-type='list' data-id='${list.listID}'>VIEW</button>`;
    });
    return markup;
  }
}

export default new LogEntryView();
