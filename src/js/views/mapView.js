import mtnIconRed from "url:../../img/mtn-icon-red.png";
import mtnIconGreen from "url:../../img/mtn-icon-green.png";
import markerIcon from "url:../../img/marker-icon.png";

class MapView {
  #data;
  #map;
  #markersLayer;
  #locationMarker;
  #markersArr = [];
  #navBtn = document.querySelector("#nav-btn-map");
  #btnLocation = document.querySelector(".btn-location");
  #btnLoadData = document.querySelector("#btn-load-data-map");
  #btnClearData = document.querySelector("#btn-clear-data-map");
  #mapDiv = document.querySelector("#map");

  // PUBLIC METHODS

  addHandlerNavClick(handler) {
    this.#navBtn.addEventListener("click", handler);
  }

  addHandlerLoadData(handler) {
    this.#btnLoadData.addEventListener("click", handler);
  }

  addHandlerClearAllData(handler) {
    this.#btnClearData.addEventListener("click", handler);
  }

  addHandlerGetLocation(handler) {
    this.#btnLocation.addEventListener("click", handler);
  }

  loadMap() {
    this.#map = new L.Map("map", {
      zoomControl: false,
    }).setView([39.402244340292775, -108.45703125000001], 4);

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

    this.#setMapHeight();
  }

  setMapView(coords) {
    this.#map.setView(coords, 16);
    const icon = L.icon({
      iconUrl: markerIcon,
      iconAnchor: [0, 41],
      popupAnchor: [12, -20],
    });
    this.#locationMarker = new L.Marker(coords, {
      icon: icon,
    });
    this.#locationMarker.addTo(this.#map);
  }

  clearMap() {
    this.#markersLayer && this.#markersLayer.clearLayers();
    this.#markersArr = [];
  }

  plotPeaksOnMap(data) {
    this.#data = data.data;
    this.clearMap();
    this.#createMarkerLayer();
    this.#map.addLayer(this.#markersLayer);
    const padding = window.matchMedia("(max-width: 800px)").matches
      ? [0, 0]
      : [650, 0];
    this.#map.fitBounds(this.#markersLayer.getBounds(), {
      paddingTopLeft: padding,
      maxZoom: 10,
    });
  }

  addLocationPopup(address) {
    this.#locationMarker
      .bindPopup(L.popup({}))
      .setPopupContent(`<div class='location-popup'>${address}</div>`);
    this.#locationMarker.on("mouseover", function () {
      this.openPopup();
    });
    this.#locationMarker.on("click", function () {
      this.openPopup();
    });
    this.#locationMarker.openPopup();
  }

  openPopup(peakId) {
    const marker = this.#markersArr.find(
      (marker) => marker.options.id === +peakId
    );
    marker.openPopup();
  }

  // PRIVATE METHODS

  #createMarker(peak) {
    const mtnIcon = L.icon({
      iconUrl: `${peak.completed ? mtnIconGreen : mtnIconRed}`,
      iconSize: [25, 20],
    });
    const marker = new L.Marker([peak.lat, peak.long], {
      icon: mtnIcon,
      id: peak.id,
      riseOnHover: true,
    });
    marker
      .bindPopup(L.popup({}))
      .setPopupContent(this.#generatePopupMarkup(peak));
    marker.on("mouseover", function () {
      this.openPopup();
    });
    marker.on("click", function () {
      this.openPopup();
    });
    return marker;
  }

  #createMarkerLayer() {
    this.#markersLayer = new L.featureGroup();
    this.#data.peaks.forEach((peak) => {
      const marker = this.#createMarker(peak);
      this.#markersArr.push(marker);
      this.#markersLayer.addLayer(marker);
    });
  }

  #generatePopupMarkup(peak) {
    const markup = `<div class='peak-popup' data-id=${peak.id}>
        <span class='peak-popup__label-name'>${peak.name}</span>
        <span class='peak-popup__label-elevation'>${peak.elevation.toLocaleString()} ft.</span>
        ${
          peak.completed
            ? this.#generateCompletedDateMarkup(peak)
            : this.#generateLogTripButtonMarkup(peak)
        }
      </div>`;
    return markup;
  }

  #generateLogTripButtonMarkup(peak) {
    const markup = `<button class='btn btn-text btn-text-green btn-log-trip' data-peak-id='${
      peak.id
    }' data-list-id='${this.#data.id}'>LOG TRIP</button>`;
    return markup;
  }

  #generateCompletedDateMarkup(peak) {
    const markup = `<span class="peak-popup__label-date"><strong>Hiked On:</strong><br/>${peak.completedDate}</span>`;
    return markup;
  }

  #setMapHeight() {
    if (window.matchMedia("(max-width: 800px)").matches) {
      this.#mapDiv.style.height = window.innerHeight;
    }
  }
}

export default new MapView();
