class ModalView {
  #modal = document.querySelector(".modal");
  #overlay = document.querySelector(".overlay");
  #btnClose = this.#modal.querySelector(".btn-close");
  #btnLoadData = this.#modal.querySelector(".btn-load-data");
  #btnStartScratch = this.#modal.querySelector(".btn-start-scratch");

  constructor() {
    this.#addHandlerCloseModal();
  }

  // PUBLIC METHODS

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
    this.#btnClose.addEventListener("click", this.#closeModal.bind(this));
    this.#overlay.addEventListener("click", this.#closeModal.bind(this));
    this.#btnStartScratch.addEventListener(
      "click",
      this.#closeModal.bind(this)
    );
  }

  #closeModal() {
    this.#modal.classList.add("hidden");
    this.#overlay.classList.add("hidden");
  }
}

export default new ModalView();
