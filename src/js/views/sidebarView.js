import icons from "../../img/sprite.svg";

class SidebarView {
  #containerMain = document.querySelector(".container-main");
  #sidebar = document.querySelector(".sidebar");
  #btnSidebar = document.querySelector(".sidebar__btn");
  #btnSidebarIcon = this.#btnSidebar.querySelector("use");
  #btnAbout = document.querySelector(".btn-about");

  // PUBLIC METHODS

  constructor() {
    this.#addHandlerRemovePreload();
  }

  addHandlerSidebar(handler) {
    this.#btnSidebar.addEventListener("click", handler);
  }

  addHandlerBtnAbout(handler) {
    this.#btnAbout.addEventListener("click", handler);
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

  // PRIVATE METHODS

  #addHandlerRemovePreload() {
    window.addEventListener(
      "load",
      function () {
        this.#sidebar.classList.remove("preload");
      }.bind(this)
    );
  }
}

export default new SidebarView();
