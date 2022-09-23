"use strict";

class PeakList {
  markers = [];
  constructor(title, id, data, center, zoom) {
    this.title = title;
    this.id = id;
    this.data = data;
    this.peakCount = data.length;
    this.center = center;
    this.zoom = zoom;
  }

  createMarker(peakObj, color = "red") {
    const mtnIcon = L.icon({
      iconUrl: `mtn-icon-${color}.png`,
      iconSize: [25, 20],
    });
    const marker = new L.Marker([peakObj.lat, peakObj.long], { icon: mtnIcon });
    marker.bindPopup(L.popup({})).setPopupContent(
      `<div class='peak-popup'>
              <span class='peak-popup__label-name'>${peakObj.name}</span>
              <span class='peak-popup__label-elevation'>${peakObj.elevFeet} ft.</span>
              <button class='btn btn--text btn-log-trip' data-mtn-id='${peakObj.id}' data-list-id='${this.id}'>LOG TRIP</button>
            </div>`
    );
    return marker;
  }

  createMarkerLayer() {
    this.data.forEach((peakObj) => {
      const color = `${
        currentUser.completedPeaks.includes(peakObj.id) ? "green" : "red"
      }`;
      const marker = this.createMarker(peakObj, color);
      this.markers.push(marker);
    });

    this.markersLayer = L.layerGroup(this.markers);
  }

  clearPeaksOnMap() {
    this.markersLayer && this.markersLayer.clearLayers();
    this.markers = [];
  }
}

co14 = new PeakList(
  "Colorado 14ers",
  "co14",
  co14,
  [38.76958342598271, -108.5459199218751],
  8
);

me4k = new PeakList(
  "Maine 4,000 Footers",
  "me4k",
  me4k,
  [45.11352900692261, -72.22412109375001],
  8
);

nh4k = new PeakList(
  "New Hampshire 4,000 Footers",
  "nh4k",
  nh4k,
  [44.20681942220478, -72.09640502929689],
  10
);

vt4k = new PeakList(
  "Vermont 4,000 Footers",
  "vt4k",
  vt4k,
  [44.08363928284644, -74.08355712890626],
  9
);

neHigh = new PeakList(
  "New England State Highpoints",
  "neHigh",
  neHigh,
  [43.739352079154706, -76.03637695312501],
  7
);

adk46 = new PeakList(
  "Adirondack High Peaks",
  "adk46",
  adk46,
  [44.09153051045221, -74.57519531250001],
  10
);

let ne4k = new PeakList(
  "New England 4,000 Footers",
  "ne4k",
  [...nh4k.data, ...me4k.data, ...vt4k.data],
  [44.54350521320822, -73.39753417968751],
  8
);

let ne100 = new PeakList(
  "New England 100 Highest",
  "ne100",
  [...ne4k.data, ...ne100rest],
  [44.54350521320822, -73.39753417968751],
  8
);

const peakListsArr = [co14, me4k, nh4k, vt4k, neHigh, adk46, ne4k, ne100];

const all = new PeakList(
  "All Peaks",
  "all",
  [...new Set(peakListsArr.flatMap((peakList) => peakList.data))],
  [39.63953756436671, -107.7978515625],
  5
);

peakListsArr.push(all);

const peakMap = new Map();

const elevationMap = new Map();

all.data.forEach((peakObj) => {
  peakMap.set(peakObj.id, peakObj.name);
});

all.data.forEach((peakObj) => elevationMap.set(peakObj.id, peakObj.elevFeet));