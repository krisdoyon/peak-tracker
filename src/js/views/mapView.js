class MapView {
  #map;
  #markersArr = [];
  #markersLayer;

  // PUBLIC METHODS

  loadMap(coords = [44.0444, -71.6684]) {
    this.#map = new L.Map("map", {
      zoomControl: false,
    }).setView(coords, 14);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    L.control
      .zoom({
        position: "bottomright",
      })
      .addTo(this.#map);
  }

  plotListOnMap(list, completedPeaks) {
    this.clearMap();
    this.#map.setView(list.center, list.zoom);
    this.#createMarkerLayer(list, completedPeaks);
    this.#map.addLayer(this.#markersLayer);
  }

  clearMap() {
    this.#markersLayer && this.#markersLayer.clearLayers();
    this.#markersArr = [];
  }

  // PRIVATE METHODS

  #createMarker(peakObj, list, color) {
    const mtnIcon = L.icon({
      iconUrl: new URL(`../../img/mtn-icon-${color}.png`, import.meta.url),
      iconSize: [25, 20],
    });
    const marker = new L.Marker([peakObj.lat, peakObj.long], { icon: mtnIcon });
    marker.bindPopup(L.popup({})).setPopupContent(
      `<div class='peak-popup'>
              <span class='peak-popup__label-name'>${peakObj.name}</span>
              <span class='peak-popup__label-elevation'>${peakObj.elevFeet} ft.</span>
              <button class='btn btn--text btn--text-green btn-log-trip' data-mtn-id='${peakObj.id}' data-list-id='${list.listID}'>LOG TRIP</button>
            </div>`
    );
    return marker;
  }

  #createMarkerLayer(list, completedPeaks) {
    list.peaks.forEach((peakObj) => {
      const color = `${completedPeaks.includes(peakObj.id) ? "green" : "red"}`;
      const marker = this.#createMarker(peakObj, list, color);
      this.#markersArr.push(marker);
    });
    this.#markersLayer = L.layerGroup(this.#markersArr);
  }
}

export default new MapView();
