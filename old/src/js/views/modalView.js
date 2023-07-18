class ModalView {
  #modal = document.querySelector(".modal");
  #overlay = document.querySelector(".overlay");
  #btnClose = this.#modal.querySelector(".btn-close");
  #btnLoadData = this.#modal.querySelector(".btn-load-data");
  #btnStartScratch = this.#modal.querySelector(".btn-start-scratch");
  #navBtn = document.querySelector("#nav-btn-about");
  #body = document.querySelector("body");

  constructor() {
    this.#addHandlerCloseModal();
    this.#addHandlerNav();
  }

  // PUBLIC METHODS

  #addHandlerNav() {
    this.#navBtn.addEventListener("click", this.openModal.bind(this));
  }

  addHandlerLoadData(handler) {
    this.#btnLoadData.addEventListener(
      "click",
      function () {
        this.#closeModal();
        handler();
      }.bind(this)
    );
  }

  openModal() {
    this.#modal.classList.remove("hidden");
    this.#overlay.classList.remove("hidden");
  }

  // PRIVATE METHODS

  #addHandlerCloseModal() {
    [this.#btnClose, this.#overlay, this.#btnStartScratch].forEach((el) =>
      el.addEventListener("click", this.#closeModal.bind(this))
    );
  }

  #closeModal() {
    this.#modal.classList.add("hidden");
    this.#overlay.classList.add("hidden");
  }
}

export default new ModalView();
