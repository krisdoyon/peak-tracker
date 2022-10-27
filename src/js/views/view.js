export default class View {
  href;
  _navBtn;
  _container;
  _allContainers = document.querySelectorAll(".container");
  _containerMain = document.querySelector(".container-main");
  _allNavBtns = document.querySelectorAll(".nav__btn");

  addHandlerNavClick(handler) {
    this._navBtn.addEventListener("click", function () {
      handler();
    });
  }

  showContainer() {
    window.history.replaceState(null, "", this.href);
    this._allContainers.forEach((container) =>
      container.classList.add("hidden")
    );
    this._containerMain.classList.remove("hidden");
    this._container.classList.remove("hidden");
    this._allNavBtns.forEach((btn) => btn.classList.remove("nav__btn--active"));
    this._navBtn.classList.add("nav__btn--active");
  }

  hideContainer() {
    this._containerMain.classList.add("hidden");
    this._allContainers.forEach((container) =>
      container.classList.add("hidden")
    );
  }
}
