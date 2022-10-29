import icons from "../../img/sprite.svg";
import View from "./view.js";

class newEntryView extends View {
  hash = "#new-entry";
  _navBtn = document.querySelector("#nav-btn-new-entry");
  _container = document.querySelector(".container-new-entry");
  #gridDate = document.querySelector(".form-new-entry__date-grid");
  #gridPeakCheckboxes = document.querySelector(
    ".form-new-entry__checkbox-grid"
  );
  #gridStats = document.querySelector(".form-new-entry__stats-grid");
  #statRows = [...document.querySelectorAll(".form-new-entry__stat-row")];
  #statRowIcons = [...this.#gridStats.querySelectorAll(".btn-icon__icon")];
  #inputDate = document.querySelector("#date");
  #chooseListSelect = document.querySelector("#choose-list-new-entry");
  #inputElevation = document.querySelector("#elevation");
  #inputDistance = document.querySelector("#distance");
  #inputHours = document.querySelector("#hours");
  #inputMinutes = document.querySelector("#minutes");
  #inputNotes = document.querySelector("#notes");
  #wrapperStars = document.querySelector(".form-new-entry__wrapper-stars");
  #allStarButtons = [...document.querySelectorAll(".btn-star")];
  #formNewEntry = document.querySelector("#form-new-entry");
  #btnClearForm = document.querySelector(".btn-clear-form");
  #btnAddEntry = document.querySelector("#add-entry");

  constructor() {
    super();
    this.#addHandlerToggleStat();
    this.#addHandlerStarMouseover();
    this.#addHandlerStarMouseout();
    this.#addHandlerStarClick();
    this.#addHandlerDatePicker();
  }

  // PUBLIC METHODS

  #addHandlerDatePicker() {
    this.#inputDate.addEventListener(
      "click",
      function () {
        this.#inputDate.showPicker();
      }.bind(this)
    );
  }

  addHandlerClearForm(handler) {
    this.#btnClearForm.addEventListener("click", handler);
  }

  addHandlerDate(handler) {
    this.#gridDate.addEventListener("click", function (e) {
      e.preventDefault();
      const clicked = e.target.closest(".btn-date");
      if (!clicked) return;
      const date = clicked.textContent.toLowerCase().trim();
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
    this.#formNewEntry.addEventListener(
      "submit",
      function (e) {
        e.preventDefault();
        const formData = this.getFormData();
        handler(formData);
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
    this.#gridPeakCheckboxes.innerHTML = this.#generateCheckboxGridMarkup(data);
    this.#chooseListSelect.value = data.listID;
    if (data.checkedID) {
      const checkbox = [
        ...this.#gridPeakCheckboxes.querySelectorAll("input"),
      ].find((input) => +input.value === data.checkedID);
      checkbox.checked = true;
    }
  }

  getFormData() {
    const formData = {
      date: this.#inputDate.value || undefined,
      peakIDs: this.#getCheckedPeaks(),
      elevation: this.#inputElevation.value || undefined,
      distance: this.#inputDistance.value || undefined,
      hours: this.#inputHours.value || undefined,
      minutes: this.#inputMinutes.value || undefined,
      notes: this.#inputNotes.value || undefined,
      rating: this.#getRating(),
    };
    return formData;
  }

  initializeListSelect(data) {
    this.#chooseListSelect.insertAdjacentHTML(
      "beforeend",
      data.map((list) => this.#generateSelectRowMarkup(list)).join("")
    );
  }

  isFormEmpty() {
    const formData = this.getFormData();
    const isEmpty = Object.values(formData).every(
      (input) => input === undefined
    );
    return isEmpty;
  }

  // PRIVATE METHODS

  #addHandlerToggleStat() {
    this.#gridStats.addEventListener("click", this.#toggleStat.bind(this));
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

  #generateSelectRowMarkup(list) {
    const markup = `<option value="${list.listID}">${list.title}</option>`;
    return markup;
  }

  #generateCheckboxGridMarkup(data) {
    return data.peaks.map(this.#generateSingleCheckboxMarkup).join("");
  }

  #generateSingleCheckboxMarkup(peak) {
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

  #getCheckedPeaks() {
    const allCheckboxesArr = [
      ...this.#gridPeakCheckboxes.querySelectorAll("input"),
    ];
    const checkedPeaksIDArr = allCheckboxesArr
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => +checkbox.value);
    return checkedPeaksIDArr.length > 0 ? checkedPeaksIDArr : undefined;
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

  #getRating() {
    return (
      +this.#allStarButtons.filter((star) => star.dataset.filled === "true")
        .length || undefined
    );
  }
}

export default new newEntryView();
