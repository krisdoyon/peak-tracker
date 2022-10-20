class newEntryView {
  #gridDate = document.querySelector(".grid-date");
  #gridPeakCheckboxes = document.querySelector(".grid-peak-checkboxes");
  #gridStats = document.querySelector(".grid-stats");
  #statRows = document.querySelectorAll(".stat-row");
  #statRowIcons = [...document.querySelectorAll(".stat-row__icon")];
  #inputDate = document.querySelector("#date");
  #chooseListSelect = document.querySelector("#choose-list");
  #inputElevation = document.querySelector("#elevation");
  #inputDistance = document.querySelector("#distance");
  #inputHours = document.querySelector("#hours");
  #inputMinutes = document.querySelector("#minutes");
  #inputNotes = document.querySelector("#notes");
  #wrapperStars = document.querySelector(".wrapper-stars");
  #allStarIcons = [...document.querySelectorAll(".star-icon")];
  #allStarButtons = [...document.querySelectorAll(".btn-star")];
  #formNewEntry = document.querySelector("#form-new-entry");
  #btnClearForm = document.querySelector(".btn-clear-form");
  #btnAddEntry = document.querySelector(".btn-add-entry");

  constructor() {
    this.#addHandlerToggleStat();
    this.#addHandlerStarMouseover();
    this.#addHandlerStarMouseout();
    this.#addHandlerStarClick();
    this.#addHandlerClearForm();
  }

  // PUBLIC METHODS

  addHandlerDate(handler) {
    this.#gridDate.addEventListener("click", function (e) {
      e.preventDefault();
      const btn = e.target.closest(".btn-date");
      if (!btn) return;
      const date = btn.textContent.toLowerCase().trim();
      handler(date);
    });
  }

  addHandlerPeakListSelect(handler) {
    this.#chooseListSelect.addEventListener(
      "change",
      function (e) {
        const listID = e.target.value;
        handler(listID);
      }.bind(this)
    );
  }

  addHandlerAddEntry(handler) {
    this.#btnAddEntry.addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        if (!this.#inputDate.value) {
          alert("Please enter a date");
          return;
        }

        const peaks = this.#getCheckedPeaks();
        if (peaks.length <= 0) {
          alert("Choose at least one peak from a list");
          return;
        }

        const data = [
          this.#inputDate.value,
          peaks,
          this.#chooseListSelect.value,
          +this.#inputElevation.value,
          +this.#inputDistance.value,
          +this.#inputHours.value,
          +this.#inputMinutes.value,
          this.#inputNotes.value,
          this.#getRating(),
        ];
        handler(data, this.#chooseListSelect.value);
        this.clearNewEntryForm();
      }.bind(this)
    );
  }

  changeDate(date) {
    this.#inputDate.value = date;
  }

  displayCheckboxes(displayArr, listID, checkedMtnID) {
    this.#gridPeakCheckboxes.classList.remove("hidden");
    this.#gridPeakCheckboxes.innerHTML = "";
    displayArr.forEach((peak) =>
      this.#gridPeakCheckboxes.insertAdjacentHTML(
        "beforeend",
        `<input type="checkbox" value="${peak.id}"/><label
            for="title"
            class="form__label--units"
            >${peak.name}
          </label>`
      )
    );
    if (checkedMtnID) {
      this.#chooseListSelect.value = listID;
      const checkbox = [
        ...this.#gridPeakCheckboxes.querySelectorAll("input"),
      ].find((input) => +input.value === +checkedMtnID);
      checkbox.checked = "true";
    }
  }

  clearNewEntryForm() {
    for (const starIcon of this.#allStarIcons) {
      this.#clearStar(starIcon);
      starIcon.closest(".btn-star").dataset.filled = "false";
    }
    this.#gridPeakCheckboxes.innerHTML = "";
    this.#gridPeakCheckboxes.classList.add("hidden");
    this.#statRowIcons.forEach((icon) => (icon.textContent = "add_circle"));
    this.#statRows.forEach((row) => row.classList.add("invisible"));
    this.#formNewEntry.reset();
  }

  // PRIVATE METHODS

  #addHandlerToggleStat() {
    this.#gridStats.addEventListener("click", this.#toggleStat.bind(this));
  }

  #toggleStat(e) {
    e.preventDefault();
    const clicked = e.target.closest(".btn-add-stat");
    let icon = e.target.textContent.trim();
    if (!clicked) return;
    this.#statRows.forEach(
      (row) =>
        row.dataset.stat === clicked.dataset.stat &&
        row.classList.toggle("invisible")
    );
    e.target.textContent =
      icon === "add_circle" ? "remove_circle" : "add_circle";
  }

  #addHandlerStarMouseover() {
    this.#wrapperStars.addEventListener(
      "mouseover",
      this.#handleStarMouseOver.bind(this)
    );
  }

  #addHandlerStarMouseout() {
    this.#wrapperStars.addEventListener(
      "mouseout",
      this.#handleStarMouseOut.bind(this)
    );
  }

  #addHandlerStarClick() {
    this.#wrapperStars.addEventListener(
      "click",
      this.#handleStarClick.bind(this)
    );
  }

  #handleStarMouseOver(e) {
    const hovered = e.target.closest(".btn-star");
    if (!hovered) return;
    for (const starBtn of this.#allStarButtons) {
      const starIcon = starBtn.querySelector(".star-icon");
      starBtn.dataset.num <= hovered.dataset.num
        ? this.#fillStar(starIcon)
        : this.#clearStar(starIcon);
    }
  }

  #handleStarMouseOut() {
    for (const starBtn of this.#allStarButtons) {
      const starIcon = starBtn.querySelector(".star-icon");
      if (starBtn.dataset.filled === "false") {
        this.#clearStar(starIcon);
      } else {
        this.#fillStar(starIcon);
      }
    }
  }

  #handleStarClick(e) {
    e.preventDefault();
    const clicked = e.target.closest(".btn-star");
    if (!clicked) return;
    for (const starBtn of this.#allStarButtons) {
      const starIcon = starBtn.querySelector(".star-icon");
      if (starBtn.dataset.num <= clicked.dataset.num) {
        this.#fillStar(starIcon);
        starBtn.dataset.filled = "true";
      } else {
        this.#clearStar(starIcon);
        starBtn.dataset.filled = "false";
      }
    }
  }

  #fillStar(starIcon) {
    starIcon.textContent = "star";
    starIcon.classList.add("star-icon--full");
  }

  #clearStar(starIcon) {
    starIcon.textContent = "star_border";
    starIcon.classList.remove("star-icon--full");
  }

  #addHandlerClearForm() {
    this.#btnClearForm.addEventListener(
      "click",
      this.clearNewEntryForm.bind(this)
    );
  }

  #getCheckedPeaks() {
    const allCheckboxesArr = [
      ...this.#gridPeakCheckboxes.querySelectorAll("input"),
    ];
    const checkedPeaksIDArr = allCheckboxesArr
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => +checkbox.value);
    return checkedPeaksIDArr;
  }

  #getRating() {
    return +this.#allStarButtons.filter(
      (star) => star.dataset.filled === "true"
    ).length;
  }
}

export default new newEntryView();
