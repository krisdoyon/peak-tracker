import icons from "../../img/sprite.svg";

export default class LogView {
  // PUBLIC METHODS

  addHandlerDeleteEntry(handler) {
    this._container.addEventListener("click", function (e) {
      const clicked = e.target.closest(".btn-delete-entry");
      if (!clicked) return;
      if (confirm("Are you sure you want to delete this entry?")) {
        const { logId } = clicked.dataset;
        handler(+logId);
      }
    });
  }

  // PRIVATE METHODS

  _generateDeleteButtonMarkup(entry, size) {
    const markup = `
      <button class="btn btn-icon btn-delete-entry" data-log-id='${
        entry.logID
      }'>
        <svg class="btn-icon__icon${size === "small" ? "--sm" : ""}">
          <use href="${icons}#icon-trash"></use>
        </svg>
      </button>
     `;
    return markup;
  }
}
