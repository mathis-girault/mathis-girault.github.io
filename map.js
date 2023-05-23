// class Point utiliser pour définir une coordonnée géographique
class Point {
  latitude;
  longitude;
  constructor(lat, lon) {
    this.latitude = lat;
    this.longitude = lon;
  }
}

// Icon des marqueurs par defaut
const iconOptions = {
  iconSize: [25, 35],
  iconAnchor: [11, 30],
  popupAnchor: [0, 0],
};
const iconHtml = (iconUrl, number) => {
  return `<img src="${iconUrl}" width="${iconOptions.iconSize[0]}" height="${iconOptions.iconSize[1]}"/>
<div class="marker-number">${number}</div>`;
};

// Permet de retenir les marqueurs pour les cleans plus tard
let dictStageMarkers = {};
let dictSemester1Markers = {};
// La carte afficher sur l'écran
let map = null;
const stageMarkersGroup = L.layerGroup();
const semester1MarkersGroup = L.layerGroup();

// Initialise la map sur une position pos et un zoom z
function getMap(p, z) {
  map = L.map("map").setView([p.latitude, p.longitude], z);

  // Add classic map view
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    minZoom: 2,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Set max bounds for the map
  const bounds = L.latLngBounds(L.latLng(-75, -180), L.latLng(90, 180));
  map.setMaxBounds(bounds); // Set the maximum bounds for the map

  // Disable dragging of the map outside the bounds
  map.on("drag", function () {
    map.panInsideBounds(bounds, { animate: false });
  });
}

/**
 * Ajoute un marqeur
 * @param {Point} pos position du point
 * @returns le marqueur
 */
function addMarker(pos, group) {
  const iconUrl = group ? "images/marker_red.png" : "images/marker_blue.png";

  const marker = L.marker([pos.latitude, pos.longitude], {
    icon: L.divIcon({
      className: "custom-marker",
      html: iconHtml(iconUrl, 1),
      iconAnchor: iconOptions.iconAnchor,
    }),
  });

  if (group) {
    marker.addTo(stageMarkersGroup);
  } else {
    marker.addTo(semester1MarkersGroup);
  }

  return marker;
}

// Ajoute un marqueur sur la page et le met dans la liste des marqueurs
export function addAndPushMarker(x, y, personDetails) {
  const pos = new Point(x, y);
  // Position not in stage or semester1
  const key = JSON.stringify(pos);
  const dictMarkers = personDetails.isStage
    ? dictStageMarkers
    : dictSemester1Markers;

  if (!(key in dictMarkers)) {
    let marker = addMarker(pos, personDetails.isStage);
    marker.on("click", () => clickOnMarker(dictMarkers, key, marker));
    dictMarkers[key] = { marker, details: [personDetails] };
  } else {
    dictMarkers[key]["details"].push(personDetails);

    // Changing new icon with full marker and new number
    const markerIcon = dictMarkers[key]["marker"].getIcon();
    markerIcon.options.html = iconHtml(
      personDetails.isStage
        ? "images/marker_red_full.png"
        : "images/marker_blue_full.png",
      dictMarkers[key]["details"].length
    );
    dictMarkers[key]["marker"].setIcon(markerIcon);
  }
}

function clickOnMarker(dictMarkers, key, marker) {
  const joinedNames = Object.values(dictMarkers[key]["details"])
    .map((marker) => marker.name)
    .join(", ");

  const content = `
    <h3>${dictMarkers[key]["details"][0].city} - ${
    dictMarkers[key]["details"][0].isStage ? "Stage" : "semester1"
  }</h3>
    <p class="popup-desc">${joinedNames}</p>
  `;

  const _popup = L.popup({
    className: dictMarkers[key]["details"][0].isStage ? "stage" : "semester1",
  })
    .setLatLng(marker.getLatLng())
    .setContent(content)
    .openOn(map);
}

export function displayMarkerGroup(group) {
  if (group) {
    semester1MarkersGroup.removeFrom(map);
    stageMarkersGroup.addTo(map);
  } else {
    stageMarkersGroup.removeFrom(map);
    semester1MarkersGroup.addTo(map);
  }
}

// Transforme une adresse en une géolocalisation
export function getPosFromAdresse(text) {
  const baseUrl = "https://nominatim.openstreetmap.org/search";
  const params = {
    format: "json",
    q: text,
  };
  const url = `${baseUrl}?${new URLSearchParams(params)}`;

  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        if (result.length > 0) {
          const firstResult = result[0];
          const lat = parseFloat(firstResult.lat);
          const lon = parseFloat(firstResult.lon);
          const pos = new Point(lat, lon);
          resolve(pos);
        } else {
          reject(new Error("No results found for the provided address."));
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        reject(error);
      });
  });
}

// Initialisation
export function initMap() {
  return new Promise((resolve, _) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPosition = new Point(
          position.coords.latitude,
          position.coords.longitude
        );
        getMap(userPosition, 10);
        resolve();
      },
      (error) => {
        console.log("Not accessing current position", error);
        getMap(new Point(46.96855, 2.62579), 5.5);
        resolve(); // Resolve even if there's an error
      }
    );
  });
}
