import * as mapFunctions from "./map.js";
import loadFile from "./parser.js";

window.addEventListener("DOMContentLoaded", () => {
  mapFunctions.initMap().then(() => {
    loadFile()
      .then((result) => addAllMarkers(result))
      .catch((error) => console.log("Error:", error));
  });
});

// Function that uses parsed infos to create markers
function addAllMarkers(parsedInfos) {
  parsedInfos.forEach((person) => {
    // Adding the marker for this person
    mapFunctions.getPosFromAdresse(person.city).then((pos) => {
      mapFunctions.addAndPushMarker(pos, person);
    });
  });

  initMenuEvents();
}

// Function to init the listeners for the menu items
function initMenuEvents() {
  const stageRadio = document.getElementById("stage");
  const cesureRadio = document.getElementById("cesure");

  // Event listener for the stage radio button
  stageRadio.addEventListener("change", function () {
    if (stageRadio.checked) {
      mapFunctions.displayMarkerGroup(true);
    }
  });

  // Event listener for the cesure radio button
  cesureRadio.addEventListener("change", function () {
    if (cesureRadio.checked) {
      mapFunctions.displayMarkerGroup(false);
    }
  });

  stageRadio.dispatchEvent(new Event("change"));
}
