import mtnIconRed from "url:../../img/mtn-icon-red.png";
import mtnIconGreen from "url:../../img/mtn-icon-green.png";
import markerIcon from "url:../../img/marker-icon.png";

class MapView {
  href = "/map";
  #navBtn = document.querySelector("#nav-btn-map");
  #allNavBtns = document.querySelectorAll(".nav__btn");
  #map;
  #markersArr = [];
  #markersLayer;
  #data;
  #locationMarker;
  #btnLocation = document.querySelector(".btn-location");
  #btnLoadData = document.querySelector("#btn-load-data-map");
  #btnClearData = document.querySelector("#btn-clear-data-map");

  // PUBLIC METHODS

  addHandlerNavClick(handler) {
    this.#navBtn.addEventListener(
      "click",
      function () {
        window.history.replaceState(null, "", this.href);
        this.#allNavBtns.forEach((btn) =>
          btn.classList.remove("nav__btn--active")
        );
        this.#navBtn.classList.add("nav__btn--active");
        handler();
      }.bind(this)
    );
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

  plotPeaksOnMap(data) {
    this.#data = data.data;
    this.clearMap();
    this.#createMarkerLayer();
    this.#map.addLayer(this.#markersLayer);
    this.#map.fitBounds(this.#markersLayer.getBounds(), {
      paddingTopLeft: [650, 0],
      maxZoom: 10,
    });
  }

  clearMap() {
    this.#markersLayer && this.#markersLayer.clearLayers();
    this.#markersArr = [];
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
}

export default new MapView();
