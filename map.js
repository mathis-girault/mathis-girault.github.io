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
const markerStageIcon = L.icon({
  iconUrl: "images/marker_red.png",
  iconSize: [15, 22],
  iconAnchor: [11, 22],
});
const markerCesureIcon = L.icon({
  iconUrl: "images/marker_blue.png",
  iconSize: [15, 22],
  iconAnchor: [11, 22],
});

// Permet de retenir les marqueurs pour les cleans plus tard
let dictStageMarkers = {};
let dictCesureMarkers = {};
// La carte afficher sur l'écran
let map = null;
const stageMarkersGroup = L.layerGroup();
const cesureMarkersGroup = L.layerGroup();

// Initialise la map sur une position pos et un zoom z
function getMap(p, z) {
  map = L.map("map").setView([p.latitude, p.longitude], z);

  const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
}

/**
 * Ajoute un marqeur
 * @param {Point} pos position du point
 * @returns le marqueur
 */
function addMarker(pos, group) {
  const marker = L.marker([pos.latitude, pos.longitude], {
    icon: group ? markerStageIcon : markerCesureIcon,
  });

  if (group) {
    marker.addTo(stageMarkersGroup);
  } else {
    marker.addTo(cesureMarkersGroup);
  }

  return marker;
}

// Ajoute un marqueur sur la page et le met dans la liste des marqueurs
export function addAndPushMarker(pos, personDetails) {
  // Position not in stage or cesure
  const key = JSON.stringify(pos);
  const dictMarkers = personDetails.isStage
    ? dictStageMarkers
    : dictCesureMarkers;

  if (!(key in dictMarkers)) {
    let marker = addMarker(pos, personDetails.isStage);
    marker.on("click", () => clickOnMarker(dictMarkers, key, marker));
    dictMarkers[key] = [personDetails];
  } else {
    dictMarkers[key].push(personDetails);
  }
}

function clickOnMarker(dictMarkers, key, marker) {
  const joinedNames = Object.values(dictMarkers[key])
    .map((marker) => marker.name)
    .join(", ");

  const content = `
    <h3>${dictMarkers[key][0].city} - ${
    dictMarkers[key][0].isStage ? "Stage" : "Cesure"
  }</h3>
    <p class="popup-desc">${joinedNames}</p>
  `;

  const _popup = L.popup({
    className: dictMarkers[key][0].isStage ? "stage" : "cesure",
  })
    .setLatLng(marker.getLatLng())
    .setContent(content)
    .openOn(map);
}

export function displayMarkerGroup(group) {
  if (group) {
    cesureMarkersGroup.removeFrom(map);
    stageMarkersGroup.addTo(map);
  } else {
    stageMarkersGroup.removeFrom(map);
    cesureMarkersGroup.addTo(map);
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
