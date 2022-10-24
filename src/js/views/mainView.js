import icons from "../../img/sprite.svg";

class MainView {
  #containerMain = document.querySelector(".container-main");
  #allContainers = [...document.querySelectorAll(".container")];
  #btnCloseContainer = this.#containerMain.querySelector(".btn-close");
  #btnLoadData = document.querySelector("#btn-load-data-map");
  #btnClearData = document.querySelector("#btn-clear-data-map");
  #mainNavBtns = document.querySelectorAll(".main-nav__btn");
  #mainNavList = document.querySelector(".main-nav__list");
  #sidebarHidden = false;
  #sidebar = document.querySelector(".sidebar");
  #btnSidebar = document.querySelector(".sidebar__btn");
  #btnSidebarIcon = this.#btnSidebar.querySelector("use");
  #btnAbout = document.querySelector(".btn-about");

  constructor() {
    this.#addHandlerSidebar();
    this.#addHandlerEscapeKeydown();
  }

  // PUBLIC METHODS

  addHandlerHideContainer(handler) {
    this.#btnCloseContainer.addEventListener("click", function () {
      handler();
    });
  }

  addHandlerBtnBack(handler) {
    this.#containerMain.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn-back");
      if (!btn) return;
      handler(btn.dataset.display);
    });
  }

  addHandlerMainNav(handler) {
    this.#mainNavList.addEventListener("click", function (e) {
      const clicked = e.target.closest(".main-nav__btn");
      if (!clicked) return;
      const containerID = clicked.dataset.display;
      handler(containerID);
    });
  }

  addHandlerLoadData(handler) {
    this.#btnLoadData.addEventListener("click", handler);
  }

  addHandlerClearAllData(handler) {
    this.#btnClearData.addEventListener("click", handler);
  }

  addHandlerBtnAbout(handler) {
    this.#btnAbout.addEventListener("click", handler);
  }

  showContainer(containerID) {
    const containerObj = this.#allContainers.find((container) =>
      container.classList.contains(`container-${containerID}`)
    );
    this.#allContainers.forEach((container) =>
      container.classList.add("hidden")
    );
    this.#containerMain.classList.remove("hidden");
    containerObj.classList.remove("hidden");
    this.#mainNavBtns.forEach((btn) => {
      btn.classList.remove("main-nav__btn--active");
      btn.dataset.display === containerObj.dataset.navActive &&
        btn.classList.add("main-nav__btn--active");
    });
  }

  hideContainer() {
    this.#containerMain.classList.add("hidden");
    this.#allContainers.forEach((container) =>
      container.classList.add("hidden")
    );
    this.#mainNavBtns.forEach((btn) => {
      btn.classList.remove("main-nav__btn--active");
      btn.dataset.display === "map" &&
        btn.classList.add("main-nav__btn--active");
    });
  }

  // PRIVATE METHODS

  #addHandlerSidebar() {
    this.#btnSidebar.addEventListener(
      "click",
      function () {
        this.#sidebarHidden = this.#sidebarHidden ? false : true;
        [this.#sidebar, this.#containerMain].forEach(
          (container) =>
            (container.style.marginLeft = `${
              this.#sidebarHidden ? "-18.2rem" : "0"
            }`)
        );
        this.#btnSidebarIcon.setAttribute(
          "href",
          `${icons}#icon-${
            this.#sidebarHidden ? "chevron-right" : "chevron-left"
          }`
        );
      }.bind(this)
    );
  }

  #addHandlerEscapeKeydown() {
    document.addEventListener(
      "keydown",
      function (e) {
        e.key === "Escape" &&
          !this.#containerMain.classList.contains("hidden") &&
          this.closeMainContainer();
      }.bind(this)
    );
  }
}

export default new MainView();
