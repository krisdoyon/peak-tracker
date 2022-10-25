class StatsView {
  #data;
  #statsGrid = document.querySelector(".stats-grid");

  render(data) {
    this.#data = data;
    this.#statsGrid.innerHTML = "";
    this.#statsGrid.insertAdjacentHTML(
      "beforeend",
      this.#generateStatsMarkup(data)
    );
  }

  #generateStatsMarkup() {
    const markup = `
      <span class="stats-grid__label">Number of Log Entries:</span>
      <div class="stats-grid__lists"></div>
      <span class="stats-grid__label">Total Completed Peaks:</span>
      <div class="stats-grid__lists"></div>
      <span class="stats-grid__label">Total Distance:</span>
      <div class="stats-grid__peaks"></div>
      <span class="stats-grid__label">Total Elevation Gain:</span>
      <span></span>
      <span class="stats-grid__label">Total Time:</span>
      <span></span>`;
    return markup;
  }
}

export default new StatsView();
