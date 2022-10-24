import icons from "../../img/sprite.svg";
import PeakListView from "./peakListView.js";

class PeakListPreviewView extends PeakListView {
  #data;
  #previewType;
  _container = document.querySelector(".container-peak-list-preview");
  #peakListsPreviewEl = document.querySelector(".preview-peak-lists");
  #peakListBtnsWrapper = document.querySelector(".preview-wrapper");
  #previewBtns = [...this.#peakListBtnsWrapper.querySelectorAll(".btn-text")];
  #noSavedLists = document.querySelector(".no-saved-lists");

  // PUBLIC METHODS

  addHandlerViewTable(handler) {
    this.#peakListsPreviewEl.addEventListener("click", function (e) {
      const clicked = e.target.closest(".btn-view-list");
      if (!clicked) return;
      const { listId } = clicked.dataset;
      handler(listId);
    });
  }

  addHandlerPreviewType(handler) {
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

  render(data) {
    this.#data = data.data;
    this.#previewType = data.previewType;
    this.#setActivePreviewBtn(this.#previewType);
    this.#peakListsPreviewEl.innerHTML = "";
    if (this.#data.length) {
      this.#noSavedLists.classList.add("hidden");
      this.#peakListsPreviewEl.insertAdjacentHTML(
        "beforeend",
        this.#generatePreviewMarkup(this.#data)
      );
    } else {
      this.#noSavedLists.classList.remove("hidden");
    }
  }

  // PRIVATE METHODS

  #generatePreviewMarkup() {
    return this.#data
      .map((list) => this.#generateSinglePreviewMarkup(list))
      .join("");
  }

  #generateSinglePreviewMarkup(list) {
    const markup = `<li class="preview-list__entry">
      <button class="btn btn-icon btn-save-peak-list" data-list-id='${
        list.listID
      }'>
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
        ${this._generateProgressBarMarkup(list)}
        <button class="btn btn--green btn-view btn-view-list" data-list-id="${
          list.listID
        }">VIEW</button>
    </li>`;
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

export default new PeakListPreviewView();
