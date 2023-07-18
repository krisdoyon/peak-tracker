class MainView {
  #containerMain = document.querySelector(".container-main");
  #btnCloseContainer = this.#containerMain.querySelector(".btn-close");
  #allContainers = document.querySelectorAll(".container");
  #mapNavBtn = document.querySelector("#nav-btn-map");
  #allNavBtns = document.querySelectorAll(".nav__btn");
  #body = document.querySelector("body");
  #html = document.querySelector("html");
  #dragBar = document.querySelector(".mobile-drag-bar");
  #sidebar = document.querySelector(".sidebar");

  constructor() {
    this.#addHandlerEscapeKeydown();
    this.#addHandlerRemovePreload();
    this.#addHandlerMarginTop();
  }

  // PUBLIC METHODS

  addHandlerPageLoad(handler) {
    ["load", "hashchange"].forEach((ev) =>
      window.addEventListener(ev, handler)
    );
  }

  addHandlerCloseContainer(handler) {
    this.#btnCloseContainer.addEventListener("click", handler);
  }

  addHandlerBtnBack(handler) {
    this.#containerMain.addEventListener("click", function (e) {
      const clicked = e.target.closest(".btn-back");
      if (!clicked) return;
      const { containerId } = clicked.dataset;
      handler(containerId);
    });
  }

  closeContainer() {
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

  #setMarginTop() {
    if (window.matchMedia("(max-width: 800px)").matches) {
      const innerHeight = `${window.innerHeight}px`;
      const dragBarHeight = `6rem`;
      const sidebarHeight = `${this.#sidebar.offsetHeight}px`;
      this.#containerMain.style.height = `calc(${innerHeight} - ${dragBarHeight} - ${sidebarHeight})`;
      this.#containerMain.style.marginTop = `${window.innerHeight}px`;
    }
  }

  #addHandlerMarginTop() {
    ["load", "resize"].forEach((ev) =>
      window.addEventListener(ev, this.#setMarginTop.bind(this))
    );
  }
}

export default new MainView();
