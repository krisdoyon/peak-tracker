class newEntryView {
  _gridDate = document.querySelector(".grid-date");
  _gridPeakCheckboxes = document.querySelector(".grid-peak-checkboxes");
  _gridStats = document.querySelector(".grid-stats");
  _statRows = document.querySelectorAll(".stat-row");
  _statRowIcons = [...document.querySelectorAll(".stat-row__icon")];
  _inputDate = document.querySelector("#date");
  _chooseListSelect = document.querySelector("#choose-list");
  _inputElevation = document.querySelector("#elevation");
  _inputDistance = document.querySelector("#distance");
  _inputHours = document.querySelector("#hours");
  _inputMinutes = document.querySelector("#minutes");
  _inputNotes = document.querySelector("#notes");
  _wrapperStars = document.querySelector(".wrapper-stars");
  _allStarIcons = [...document.querySelectorAll(".star-icon")];
  _allStarButtons = [...document.querySelectorAll(".btn-star")];
  _formNewEntry = document.querySelector("#form-new-entry");
  _btnClearForm = document.querySelector(".btn-clear-form");
  _btnAddEntry = document.querySelector(".btn-add-entry");

  constructor() {
    this._addHandlerToggleStat();
    this._addHandlerStarMouseover();
    this._addHandlerStarMouseout();
    this._addHandlerStarClick();
    this._addHandlerClearForm();
  }

  // PUBLIC METHODS

  addHandlerDateClick(handler) {
    this._gridDate.addEventListener("click", function (e) {
      e.preventDefault();
      const btn = e.target.closest(".btn-date");
      if (!btn) return;
      const date = btn.textContent.toLowerCase().trim();
      handler(date);
    });
  }

  changeDate(date) {
    this._inputDate.value = date;
  }

  displayCheckboxes(displayArr, listID, checkedMtnID) {
    this._gridPeakCheckboxes.classList.remove("hidden");
    this._gridPeakCheckboxes.innerHTML = "";
    displayArr.forEach((peak) =>
      this._gridPeakCheckboxes.insertAdjacentHTML(
        "beforeend",
        `<input type="checkbox" value="${peak.id}"/><label
            for="title"
            class="form__label--units"
            >${peak.name}
          </label>`
      )
    );
    if (checkedMtnID) {
      this._chooseListSelect.value = listID;
      const checkbox = [
        ...this._gridPeakCheckboxes.querySelectorAll("input"),
      ].find((input) => +input.value === +checkedMtnID);
      checkbox.checked = "true";
    }
  }

  addHandlerChangeListSelect(handler) {
    this._chooseListSelect.addEventListener(
      "change",
      function (e) {
        const listID = e.target.value;
        handler(listID);
      }.bind(this)
    );
  }

  addHandlerAddEntry(handler) {
    this._btnAddEntry.addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        if (!this._inputDate.value) {
          alert("Please enter a date");
          return;
        }

        const peaks = this._getCheckedPeaks();
        if (peaks.length <= 0) {
          alert("Choose at least one peak from a list");
          return;
        }

        const data = {
          date: this._inputDate.value,
          peaks,
          list: this._chooseListSelect.value,
          elevation: +this._inputElevation.value,
          distance: +this._inputDistance.value,
          hours: +this._inputHours.value,
          minutes: +this._inputMinutes.value,
          notes: this._inputNotes.value,
          rating: this._getRating(),
        };
        handler(data);
        this.clearNewEntryForm();
      }.bind(this)
    );
  }

  // PRIVATE METHODS

  _addHandlerToggleStat() {
    this._gridStats.addEventListener("click", this._toggleStat.bind(this));
  }

  _toggleStat(e) {
    e.preventDefault();
    const clicked = e.target.closest(".btn-add-stat");
    let icon = e.target.textContent.trim();
    if (!clicked) return;
    this._statRows.forEach(
      (row) =>
        row.dataset.stat === clicked.dataset.stat &&
        row.classList.toggle("invisible")
    );
    e.target.textContent =
      icon === "add_circle" ? "remove_circle" : "add_circle";
  }

  _addHandlerStarMouseover() {
    this._wrapperStars.addEventListener(
      "mouseover",
      this._handleStarMouseOver.bind(this)
    );
  }

  _addHandlerStarMouseout() {
    this._wrapperStars.addEventListener(
      "mouseout",
      this._handleStarMouseOut.bind(this)
    );
  }

  _addHandlerStarClick() {
    this._wrapperStars.addEventListener(
      "click",
      this._handleStarClick.bind(this)
    );
  }

  _handleStarMouseOver(e) {
    const hovered = e.target.closest(".btn-star");
    if (!hovered) return;
    for (const starBtn of this._allStarButtons) {
      const starIcon = starBtn.querySelector(".star-icon");
      starBtn.dataset.num <= hovered.dataset.num
        ? this._fillStar(starIcon)
        : this._clearStar(starIcon);
    }
  }

  _handleStarMouseOut() {
    for (const starBtn of this._allStarButtons) {
      const starIcon = starBtn.querySelector(".star-icon");
      if (starBtn.dataset.filled === "false") {
        this._clearStar(starIcon);
      } else {
        this._fillStar(starIcon);
      }
    }
  }

  _handleStarClick(e) {
    e.preventDefault();
    const clicked = e.target.closest(".btn-star");
    if (!clicked) return;
    for (const starBtn of this._allStarButtons) {
      const starIcon = starBtn.querySelector(".star-icon");
      if (starBtn.dataset.num <= clicked.dataset.num) {
        this._fillStar(starIcon);
        starBtn.dataset.filled = "true";
      } else {
        this._clearStar(starIcon);
        starBtn.dataset.filled = "false";
      }
    }
  }

  _fillStar(starIcon) {
    starIcon.textContent = "star";
    starIcon.classList.add("star-icon--full");
  }

  _clearStar(starIcon) {
    starIcon.textContent = "star_border";
    starIcon.classList.remove("star-icon--full");
  }

  _addHandlerClearForm() {
    this._btnClearForm.addEventListener(
      "click",
      this.clearNewEntryForm.bind(this)
    );
  }

  clearNewEntryForm() {
    for (const starIcon of this._allStarIcons) {
      this._clearStar(starIcon);
      starIcon.closest(".btn-star").dataset.filled = "false";
    }
    this._gridPeakCheckboxes.innerHTML = "";
    this._gridPeakCheckboxes.classList.add("hidden");
    this._statRowIcons.forEach((icon) => (icon.textContent = "add_circle"));
    this._statRows.forEach((row) => row.classList.add("invisible"));
    this._formNewEntry.reset();
  }

  _getCheckedPeaks() {
    const allCheckboxesArr = [
      ...this._gridPeakCheckboxes.querySelectorAll("input"),
    ];
    const checkedPeaksIDArr = allCheckboxesArr
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => +checkbox.value);
    return checkedPeaksIDArr;
  }

  _getRating() {
    return +this._allStarButtons.filter(
      (star) => star.dataset.filled === "true"
    ).length;
  }
}

export default new newEntryView();

// currentUser.addLogEntry(newEntry);
// this._plotListOnMap(chooseListSelect.value);
// this._clearNewEntryForm();

// const grid = document.querySelector(".grid-peak-checkboxes");
// const checkboxes = grid.querySelectorAll("input");
