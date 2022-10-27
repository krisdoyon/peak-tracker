import icons from "../../img/sprite.svg";
import PeakListView from "./peakListView.js";

class PeakListPreviewView extends PeakListView {
  href = "/peak-list-preview";
  _container = document.querySelector(".container-peak-list-preview");
  #data;
  #previewType;
  #page;
  #numPages;
  #previewGrid = document.querySelector(".preview-list--peak-lists");
  #btnsWrapper = this._container.querySelector(".preview-wrapper");
  #noSavedLists = document.querySelector(".no-saved-lists");

  // PUBLIC METHODS

  addHandlerPagination(handler) {
    this.#btnsWrapper.addEventListener(
      "click",
      function (e) {
        const clicked = e.target.closest(".btn-pagination");
        if (!clicked) return;
        handler(this.#previewType, +clicked.dataset.page);
      }.bind(this)
    );
  }

  addHandlerViewTable(handler) {
    this.#previewGrid.addEventListener("click", function (e) {
      const clicked = e.target.closest(".btn-view-list");
      if (!clicked) return;
      const { listId } = clicked.dataset;
      handler(listId);
    });
  }

  addHandlerPreviewType(handler) {
    this.#btnsWrapper.addEventListener(
      "click",
      function (e) {
        const clicked = e.target.closest(".btn-text");
        if (!clicked) return;
        const { previewType } = clicked.dataset;
        handler(previewType, 1);
      }.bind(this)
    );
  }

  render(data) {
    this.#data = data;
    this.#previewType = data.previewType;
    this.#previewGrid.innerHTML = "";
    if (this.#data.data.length) {
      this.#noSavedLists.classList.add("hidden");
      this.#previewGrid.classList.remove("hidden");
      this.#previewGrid.insertAdjacentHTML(
        "beforeend",
        this.#generatePreviewMarkup(this.#data.data)
      );
    } else {
      this.#previewGrid.classList.add("hidden");
      this.#noSavedLists.classList.remove("hidden");
    }
    this.#btnsWrapper.innerHTML = "";
    this.#btnsWrapper.insertAdjacentHTML(
      "beforeend",
      this.#generateWrapperBtnMarkup()
    );
  }

  // PRIVATE METHODS

  #generatePreviewMarkup() {
    return this.#data.data
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

  #generateWrapperBtnMarkup() {
    const curPage = this.#data.page;
    const numPages = this.#data.numPages;

    // First page, other pages
    if (curPage === 1 && numPages > 1) {
      const markup = `
      ${this.#generatePreviewButtonMarkup()}
        <button data-page="2" class="btn btn-pagination btn-pagination--next">
          <span>Page 2</span>
        </button>`;
      return markup;
    }

    // Last page, other pages
    if (curPage === numPages && numPages > 1) {
      const markup = `
        <button data-page="${
          numPages - 1
        }" class="btn btn-pagination btn-pagination--prev">
          <span>Page ${numPages - 1}</span>
        </button>
        ${this.#generatePreviewButtonMarkup()}`;
      return markup;
    }

    // First page, no other pages
    if (curPage === 1 && numPages === 1) {
      const markup = this.#generatePreviewButtonMarkup();
      return markup;
    }

    // Other page
    if (curPage < numPages) {
      const markup = `
      <button data-page="${
        curPage - 1
      }" class="btn btn-pagination btn-pagination--prev">
          <span>Page ${curPage - 1}</span>
        </button>
      ${this.#generatePreviewButtonMarkup()}
        <button data-page="${
          curPage + 1
        }" class="btn btn-pagination btn-pagination--next">
          <span>Page ${curPage + 1}</span>
        </button>`;
      return markup;
    }
  }

  #generatePreviewButtonMarkup() {
    const markup = `
    <button class="btn btn-text btn-text--light btn-all-lists ${
      this.#previewType === "all" ? "btn-text--active" : ""
    }" data-preview-type="all">
      All lists
    </button>
    <button class="btn btn-text btn-text--light btn-saved-lists ${
      this.#previewType === "saved" ? "btn-text--active" : ""
    }" data-preview-type="saved">
      Saved lists
    </button>`;
    return markup;
  }
}

export default new PeakListPreviewView();
