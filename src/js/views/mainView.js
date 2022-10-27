class MainView {
  #containerMain = document.querySelector(".container-main");
  #btnCloseContainer = this.#containerMain.querySelector(".btn-close");
  #allContainers = document.querySelectorAll(".container");
  #mapNavBtn = document.querySelector("#nav-btn-map");
  #allNavBtns = document.querySelectorAll(".nav__btn");

  constructor() {
    this.#addHandlerEscapeKeydown();
    this.#addHandlerRemovePreload();
  }

  // PUBLIC METHODS

  addHandlerPageLoad(handler) {
    window.addEventListener("load", function () {
      window.location.pathname.slice(1) ||
        this.window.history.replaceState(null, "", "/map");
      handler();
    });
  }

  addHandlerCloseContainer(handler) {
    this.#btnCloseContainer.addEventListener("click", handler);
  }

  addHandlerBtnBack(handler) {
    this.#containerMain.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn-back");
      if (!btn) return;
      handler(btn.dataset.display);
    });
  }

  closeContainer() {
    window.history.replaceState(null, "", "/map");
    this.#containerMain.classList.add("hidden");
    this.#allContainers.forEach((container) =>
      container.classList.add("hidden")
    );
    this.#allNavBtns.forEach((btn) => btn.classList.remove("nav__btn--active"));
    this.#mapNavBtn.classList.add("nav__btn--active");
  }

  // PRIVATE METHODS

  #addHandlerEscapeKeydown() {
    document.addEventListener(
      "keydown",
      function (e) {
        e.key === "Escape" &&
          !this.#containerMain.classList.contains("hidden") &&
          this.closeContainer();
      }.bind(this)
    );
  }

  #addHandlerRemovePreload() {
    window.addEventListener(
      "load",
      function () {
        this.#containerMain.classList.remove("preload");
      }.bind(this)
    );
  }
}

export default new MainView();
