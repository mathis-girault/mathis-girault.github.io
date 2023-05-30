import * as mapFunctions from "./map.js";
import * as databaseFunctions from "./database.js";

const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ '-]+$/;
const cityRegex = /^[a-zA-Z0-9À-ÖØ-öø-ÿ ',.-]+$/;

window.addEventListener("DOMContentLoaded", () => {
  // Listen for clicks on buttons
  document.getElementById("add-user").onclick = () => {
    document.getElementById("add-user-form").classList.add("selected");
    document.getElementById("form-container").style.zIndex = 1999;
  };
  document.getElementById("annuler").onclick = () => {
    document.getElementById("add-user-form").classList.remove("selected");
    document.getElementById("form-container").style.zIndex = 0;
  };
  document.getElementById("form-container").onclick = () => {
    document.getElementById("add-user-form").classList.remove("selected");
    document.getElementById("form-container").style.zIndex = 0;
  };
  document.getElementById("add-user-submit").onclick = (event) => {
    handleSendForm(event);
    document.getElementById("form-container").style.zIndex = 0;
  };
  document.getElementById("add-user-form").onclick = (event) => {
    event.stopPropagation();
  }

  // Initialize map and retreive data
  mapFunctions.initMap().then(() => {
    databaseFunctions.initDB();
    initMenuEvents();
  });
});

// Function to init the listeners for the menu items
function initMenuEvents() {
  // Event listener for the stage radio button
  const stageRadio = document.getElementById("stage");
  const semester1Radio = document.getElementById("semester1");

  stageRadio.addEventListener("change", function () {
    if (stageRadio.checked) {
      mapFunctions.displayMarkerGroup(true);
    }
  });

  // Event listener for the semester1 radio button
  semester1Radio.addEventListener("change", function () {
    if (semester1Radio.checked) {
      mapFunctions.displayMarkerGroup(false);
    }
  });

  stageRadio.dispatchEvent(new Event("change"));

  // Same on mobile devices
  const stageButton = document.getElementById("mobile-stage");
  const semester1Button = document.getElementById("mobile-semester1");
  const selectedMarker = document.querySelector(".selected-marker");

  stageButton.onclick = () => {
    stageButton.classList.add("selected");
    semester1Button.classList.remove("selected");
    selectedMarker.style.transform = "translateX(0%)";
    mapFunctions.displayMarkerGroup(true);
  };

  semester1Button.onclick = () => {
    stageButton.classList.remove("selected");
    semester1Button.classList.add("selected");
    selectedMarker.style.transform = "translateX(100%)";
    mapFunctions.displayMarkerGroup(false);
  };

  stageButton.dispatchEvent(new Event("click"));
}

function handleSendForm(event) {
  const nameInput = document.getElementById("name");
  const cityInput = document.getElementById("city");
  const isStageInput = document.querySelector('input[name="isStage"]:checked');

  // Check if the form inputs are valid
  if (nameInput.checkValidity() && cityInput.checkValidity() && isStageInput) {
    event.preventDefault(); // Prevent form submission

    const name = nameInput.value.trim();
    const city = cityInput.value.trim();

    // Test data validation
    if (!nameRegex.test(name)) {
      window.alert(
        "Invalid name input. Only alphabetic characters, spaces, and hyphens are allowed."
      );
      return;
    }
    if (!cityRegex.test(city)) {
      window.alert(
        "Invalid city input. Only alphanumeric characters, spaces, commas, periods, and hyphens are allowed."
      );
      return;
    }

    // Add the user to the database
    databaseFunctions.addUser(name, city, isStageInput.value === "stage");

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
