// Use this as a base for history, peak lists, and new entry

class View {
  displayContainer() {
    this._container.classList.remove('hidden')
  }
}


_displayContainer(containerID) {
    const containerObj = containers.find((container) =>
      container.classList.contains(`container-${containerID}`)
    );
    containers.forEach((container) => container.classList.add("hidden"));
    containerMain.classList.remove("hidden");
    containerObj.classList.remove("hidden");
    containerID === "all-peak-lists" && this._displayPeakLists();
    this._displayAllHistoryList();
    containerID === "history" && this._displayAllHistoryList();

    mainNavBtns.forEach((btn) => {
      btn.classList.remove("main-nav__btn--active");
      btn.dataset.container === containerObj.dataset.navId &&
        btn.classList.add("main-nav__btn--active");
    });
  }