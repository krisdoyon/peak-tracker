import View from "./view.js";

export default class PeakListView extends View {
  _navBtn = document.querySelector("#nav-btn-peak-lists");

  // PUBLIC METHODS

  addHandlerSavedLists(handler) {
    this._container.addEventListener("click", function (e) {
      const clicked = e.target.closest(".btn-save-peak-list");
      if (!clicked) return;
      const { listId } = clicked.dataset;
      handler(listId);
    });
  }

  // PRIVATE METHODS

  _generateProgressBarMarkup(list) {
    const width = (list.numCompleted / list.peakCount) * 100;
    const markup = `<div class='progress-bar'><div class='progress-bar__label'>${
      Math.round(width * 10) / 10
    }%</div><div class='progress-bar__progress' style="width:${width}%"></div></div>
      </div>`;
    return markup;
  }
}
