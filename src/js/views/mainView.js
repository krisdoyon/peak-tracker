import icons from "../../img/sprite.svg";

class MainView {
  #containerMain = document.querySelector(".container-main");
  #allContainers = [...document.querySelectorAll(".container")];
  #btnCloseContainer = this.#containerMain.querySelector(".btn-close");
  #btnLoadData = document.querySelector("#btn-load-data-map");
  #btnClearData = document.querySelector("#btn-clear-data-map");
  #mainNavBtns = document.querySelectorAll(".main-nav__btn");
  #mainNavList = document.querySelector(".main-nav__list");
  #sidebar = document.querySelector(".sidebar");
  #btnSidebar = document.querySelector(".sidebar__btn");
  #btnSidebarIcon = this.#btnSidebar.querySelector("use");
  #btnAbout = document.querySelector(".btn-about");

  constructor() {
    this.#addHandlerEscapeKeydown();
  }

  // PUBLIC METHODS

  addHandlerLoadPage(handler) {
    window.addEventListener(
      "load",
      function (e) {
        const containerID = window.location.pathname.slice(1) || "map";
        this.#containerMain.classList.remove("preload");
        this.#sidebar.classList.remove("preload");
        handler(containerID);
      }.bind(this)
    );
  }

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
    window.history.pushState(null, "", `/${containerID}`);
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
    window.history.pushState(null, "", `/map`);
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

  addHandlerSidebar(handler) {
    this.#btnSidebar.addEventListener("click", handler);
  }

  toggleSidebar(sidebarHidden) {
    [this.#sidebar, this.#containerMain].forEach(
      (element) =>
        (element.style.marginLeft = `${sidebarHidden ? "-18.2rem" : "0"}`)
    );
    this.#btnSidebarIcon.setAttribute(
      "href",
      `${icons}#icon-${sidebarHidden ? "chevron-right" : "chevron-left"}`
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
