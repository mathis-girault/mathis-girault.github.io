import * as mapFunctions from "./map.js";
import * as databaseFunctions from "./database.js";

window.addEventListener("DOMContentLoaded", () => {
  // Listen for clicks on buttons
  document.getElementById("add-user").onclick = () => {
    document.getElementById("add-user-form").classList.add("selected");
  };
  document.getElementById("annuler").onclick = () => {
    document.getElementById("add-user-form").classList.remove("selected");
  };
  document.getElementById("add-user-submit").onclick = (event) => {
    handleSendForm(event);
  };

  // Initialize map and retreive data
  mapFunctions.initMap().then(() => {
    databaseFunctions.initDB();
    initMenuEvents();
  });
});

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

function handleSendForm(event) {
  const nameInput = document.getElementById("name");
  const cityInput = document.getElementById("city");
  const isStageInput = document.querySelector('input[name="isStage"]:checked');

  // Check if the form inputs are valid
  if (nameInput.checkValidity() && cityInput.checkValidity() && isStageInput) {
    event.preventDefault(); // Prevent form submission

    // Add the user to the database
    databaseFunctions.addUser(
      nameInput.value.trim(),
      cityInput.value.trim(),
      isStageInput.value === "stage"
    );

    // Clear the form fields with delay
    setTimeout(() => {
      nameInput.value = "";
      cityInput.value = "";
      isStageInput.checked = false;
    }, 100);

    // Close the form
    document.getElementById("add-user-form").classList.remove("selected");
  } else {
    // Handle invalid form inputs (display error messages, etc.)
    console.log("Invalid form inputs");
  }
}
