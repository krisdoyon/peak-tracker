import mtnIconRed from "url:../../img/mtn-icon-red.png";
import mtnIconGreen from "url:../../img/mtn-icon-green.png";

class MapView {
  #map;
  #markersArr = [];
  #markersLayer;
  #data;

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

  plotListOnMap(data) {
    this.#data = data;
    this.clearMap();
    this.#map.setView(this.#data.center, this.#data.zoom);
    this.#createMarkerLayer();
    this.#map.addLayer(this.#markersLayer);
  }

  clearMap() {
    this.#markersLayer && this.#markersLayer.clearLayers();
    this.#markersArr = [];
  }

  // PRIVATE METHODS

  #createMarker(peak) {
    const mtnIcon = L.icon({
      iconUrl: `${peak.completed ? mtnIconGreen : mtnIconRed}`,
      iconSize: [25, 20],
    });
    const marker = new L.Marker([peak.lat, peak.long], { icon: mtnIcon });
    marker.bindPopup(L.popup({})).setPopupContent(
      `<div class='peak-popup'>
        <span class='peak-popup__label-name'>${peak.name}</span>
        <span class='peak-popup__label-elevation'>${peak.elevation} ft.</span>
        <button class='btn btn-text btn-text-green btn-log-trip' data-mtn-id='${
          peak.id
        }' data-list-id='${this.#data.listID}'>LOG TRIP</button>
      </div>`
    );
    return marker;
  }

  #createMarkerLayer() {
    this.#data.peaks.forEach((peak) =>
      this.#markersArr.push(this.#createMarker(peak))
    );
    this.#markersLayer = L.layerGroup(this.#markersArr);
  }
}

export default new MapView();
