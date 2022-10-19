class MainView {
  _containerMain = document.querySelector(".container-main");
  _allContainers = [...document.querySelectorAll(".container")];
  _btnCloseContainer = document.querySelector(".btn-close-container");
  _mainNavBtns = document.querySelectorAll(".main-nav__btn");
  _mainNavList = document.querySelector(".main-nav__list");
  _sidebarHidden = false;
  _sidebar = document.querySelector(".sidebar");
  _btnSidebar = document.querySelector(".sidebar__btn");
  _btnSidebarIcon = document.querySelector(".sidebar__btn--icon");

  constructor() {
    this._addHandlerSidebar();
    this._addHandlerEscapeKeydown();
  }

  addHandlerCloseMainContainer(handler) {
    this._btnCloseContainer.addEventListener("click", function () {
      handler();
    });
  }

  addHandlerMainNavClick(handler) {
    this._mainNavList.addEventListener("click", function (e) {
      const clicked = e.target.closest(".main-nav__btn");
      if (!clicked) return;
      const containerID = clicked.dataset.container;
      handler(containerID);
    });
  }

  displayContainer(containerID) {
    const containerObj = this._allContainers.find((container) =>
      container.classList.contains(`container-${containerID}`)
    );
    this._allContainers.forEach((container) =>
      container.classList.add("hidden")
    );
    this._containerMain.classList.remove("hidden");
    containerObj.classList.remove("hidden");
    this._mainNavBtns.forEach((btn) => {
      btn.classList.remove("main-nav__btn--active");
      btn.dataset.container === containerObj.dataset.navId &&
        btn.classList.add("main-nav__btn--active");
    });
  }

  closeMainContainer() {
    this._containerMain.classList.add("hidden");
    this._allContainers.forEach((container) =>
      container.classList.add("hidden")
    );
    this._mainNavBtns.forEach((btn) => {
      btn.classList.remove("main-nav__btn--active");
      btn.dataset.container === "map" &&
        btn.classList.add("main-nav__btn--active");
    });
  }

  _addHandlerSidebar() {
    this._btnSidebar.addEventListener(
      "click",
      function () {
        this._sidebarHidden = this._sidebarHidden ? false : true;
        this._sidebar.style.marginLeft = `${
          this._sidebarHidden ? "-17.8rem" : "0"
        }`;
        this._btnSidebarIcon.innerHTML = this._sidebarHidden
          ? "chevron_right"
          : "chevron_left";
      }.bind(this)
    );
  }

  _addHandlerEscapeKeydown() {
    document.addEventListener(
      "keydown",
      function (e) {
        e.key === "Escape" &&
          !this._containerMain.classList.contains("hidden") &&
          this.closeMainContainer();
      }.bind(this)
    );
  }
}

export default new MainView();
