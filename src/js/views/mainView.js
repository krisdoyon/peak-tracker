class MainView {
  #containerMain = document.querySelector(".container-main");
  #allContainers = [...document.querySelectorAll(".container")];
  #btnCloseContainer = document.querySelector(".btn-close-container");
  #mainNavBtns = document.querySelectorAll(".main-nav__btn");
  #mainNavList = document.querySelector(".main-nav__list");
  #sidebarHidden = false;
  #sidebar = document.querySelector(".sidebar");
  #btnSidebar = document.querySelector(".sidebar__btn");
  #btnSidebarIcon = document.querySelector(".sidebar__btn--icon");

  constructor() {
    this.#addHandlerSidebar();
    this.#addHandlerEscapeKeydown();
  }

  // PUBLIC METHODS

  addHandlerCloseMainContainer(handler) {
    this.#btnCloseContainer.addEventListener("click", function () {
      handler();
    });
  }

  addHandlerBtnBack(handler) {
    this.#containerMain.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn-back");
      if (!btn) return;
      handler(btn.dataset.container);
    });
  }

  addHandlerMainNavClick(handler) {
    this.#mainNavList.addEventListener("click", function (e) {
      const clicked = e.target.closest(".main-nav__btn");
      if (!clicked) return;
      const containerID = clicked.dataset.container;
      handler(containerID);
    });
  }

  displayContainer(containerID) {
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
      btn.dataset.container === containerObj.dataset.navId &&
        btn.classList.add("main-nav__btn--active");
    });
  }

  closeMainContainer() {
    this.#containerMain.classList.add("hidden");
    this.#allContainers.forEach((container) =>
      container.classList.add("hidden")
    );
    this.#mainNavBtns.forEach((btn) => {
      btn.classList.remove("main-nav__btn--active");
      btn.dataset.container === "map" &&
        btn.classList.add("main-nav__btn--active");
    });
  }

  // PRIVATE METHODS

  #addHandlerSidebar() {
    this.#btnSidebar.addEventListener(
      "click",
      function () {
        this.#sidebarHidden = this.#sidebarHidden ? false : true;
        this.#sidebar.style.marginLeft = `${
          this.#sidebarHidden ? "-17.8rem" : "0"
        }`;
        this.#btnSidebarIcon.innerHTML = this.#sidebarHidden
          ? "chevron_right"
          : "chevron_left";
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
