import icons from "../../img/sprite.svg";

class newEntryView {
  #gridDate = document.querySelector(".form-new-entry__date-grid");
  #gridPeakCheckboxes = document.querySelector(
    ".form-new-entry__checkbox-grid"
  );
  #gridStats = document.querySelector(".form-new-entry__stats-grid");
  #statRows = [...document.querySelectorAll(".form-new-entry__stat-row")];
  #statRowIcons = [...this.#gridStats.querySelectorAll(".btn-icon__icon")];
  #statBtns = [...this.#gridStats.querySelectorAll(".btn-add-stat")];
  #inputDate = document.querySelector("#date");
  #chooseListSelect = document.querySelector("#choose-list-new-entry");
  #inputElevation = document.querySelector("#elevation");
  #inputDistance = document.querySelector("#distance");
  #inputHours = document.querySelector("#hours");
  #inputMinutes = document.querySelector("#minutes");
  #inputNotes = document.querySelector("#notes");
  #wrapperStars = document.querySelector(".form-new-entry__wrapper-stars");
  #allStarIcons = [...document.querySelectorAll(".btn-star__icon")];
  #allStarButtons = [...document.querySelectorAll(".btn-star")];
  #formNewEntry = document.querySelector("#form-new-entry");
  #btnClearForm = document.querySelector(".btn-clear-form");
  #btnAddEntry = document.querySelector("#add-entry");

  constructor() {
    this.#addHandlerToggleStat();
    this.#addHandlerStarMouseover();
    this.#addHandlerStarMouseout();
    this.#addHandlerStarClick();
  }

  // PUBLIC METHODS

  addHandlerClearForm(handler) {
    this.#btnClearForm.addEventListener("click", handler);
  }

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

        const peakIDs = this.#getCheckedPeaks();
        if (peakIDs.length <= 0) {
          alert("Choose at least one peak from a list");
          return;
        }

        const formData = {
          date: this.#inputDate.value,
          peakIDs,
          elevation: this.#inputElevation.value,
          distance: this.#inputDistance.value,
          hours: this.#inputHours.value,
          minutes: this.#inputMinutes.value,
          notes: this.#inputNotes.value,
          rating: this.#getRating(),
        };
        handler(formData);
        this.clearForm();
      }.bind(this)
    );
  }

  changeDate(date) {
    this.#inputDate.value = date;
  }

  clearForm() {
    for (const starBtn of this.#allStarButtons) {
      this.#clearStar(starBtn);
      starBtn.dataset.filled = "false";
    }
    this.#gridPeakCheckboxes.innerHTML = "";
    this.#gridPeakCheckboxes.classList.add("hidden");
    this.#statRowIcons.forEach(
      (icon) => (icon.innerHTML = `<use href="${icons}#icon-add"></use>`)
    );
    this.#statRows.forEach((row) => row.classList.add("invisible"));
    this.#formNewEntry.reset();
  }

  displayCheckboxes(data) {
    this.#gridPeakCheckboxes.classList.remove("hidden");
    this.#gridPeakCheckboxes.innerHTML = "";
    data.peaks.forEach((peak) =>
      this.#gridPeakCheckboxes.insertAdjacentHTML(
        "beforeend",
        this.#generateCheckboxMarkup(peak)
      )
    );
    if (data.checkedID) {
      this.#chooseListSelect.value = data.listID;
      const checkbox = [
        ...this.#gridPeakCheckboxes.querySelectorAll("input"),
      ].find((input) => +input.value === data.checkedID);
      checkbox.checked = true;
    }
  }

  #generateCheckboxMarkup(peak) {
    const markup = `
    <li>
      <label class="form-new-entry__checkbox-container">${peak.name}
        <input type="checkbox" value="${peak.id}"/>
        <span class="form-new-entry__checkmark"></span>
      </label>
    </li>
    `;
    return markup;
  }

  initializeListSelect(data) {
    this.#chooseListSelect.insertAdjacentHTML(
      "beforeend",
      data.map((list) => this.#generateSelectRowMarkup(list)).join("")
    );
  }

  // PRIVATE METHODS

  #addHandlerToggleStat() {
    this.#gridStats.addEventListener("click", this.#toggleStat.bind(this));
  }

  #toggleStat(e) {
    e.preventDefault();
    const clicked = e.target.closest(".btn-add-stat");
    if (!clicked) return;
    const icon = clicked.querySelector("use");
    const row = this.#statRows.find(
      (row) => row.dataset.stat === clicked.dataset.stat
    );
    if (row.classList.contains("invisible")) {
      row.classList.remove("invisible");
      icon.setAttribute("href", `${icons}#icon-remove`);
    } else {
      row.classList.add("invisible");
      icon.setAttribute("href", `${icons}#icon-add`);
    }
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
      starBtn.dataset.num <= hovered.dataset.num
        ? this.#fillStar(starBtn)
        : this.#clearStar(starBtn);
    }
  }

  #handleStarMouseOut() {
    for (const starBtn of this.#allStarButtons) {
      if (starBtn.dataset.filled === "false") {
        this.#clearStar(starBtn);
      } else {
        this.#fillStar(starBtn);
      }
    }
  }

  #handleStarClick(e) {
    e.preventDefault();
    const clicked = e.target.closest(".btn-star");
    if (!clicked) return;
    for (const starBtn of this.#allStarButtons) {
      if (starBtn.dataset.num <= clicked.dataset.num) {
        this.#fillStar(starBtn);
        starBtn.dataset.filled = "true";
      } else {
        this.#clearStar(starBtn);
        starBtn.dataset.filled = "false";
      }
    }
  }

  #fillStar(starBtn) {
    starBtn.querySelector("svg").classList.add("btn-star__icon--full");
    starBtn
      .querySelector("use")
      .setAttribute("href", `${icons}#icon-star-solid`);
  }

  #clearStar(starBtn) {
    starBtn.querySelector("svg").classList.remove("btn-star__icon--full");
    starBtn.querySelector("use").setAttribute("href", `${icons}#icon-star`);
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

  #generateSelectRowMarkup(list) {
    const markup = `<option value="${list.listID}">${list.title}</option>`;
    return markup;
  }
}

export default new newEntryView();
