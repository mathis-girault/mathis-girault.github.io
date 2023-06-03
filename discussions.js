import * as databaseFunctions from "./database.js";

let CITY;
let ISSTAGE;

export function openDiscussion(city, isStage) {
  CITY = city;
  ISSTAGE = isStage;

  // Setup the discussion panel
  document.getElementById("discussion-container").classList.add("selected");
  document.getElementById("discussion-container").onclick = (event) => {
    event.stopPropagation();
  };
  document.getElementById("discussion-background").classList.add("selected");
  document.getElementById("discussion-title").innerText = `${city} - ${
    isStage ? "Stage" : "Semestre 1 3A"
  }`;
  document
    .getElementById("discussion-close")
    .classList.add(isStage ? "stage" : "semester1");

  // Get existing discussion
  const unsubscribe = databaseFunctions.getDiscussion(
    city,
    isStage,
    (discussion) => {
      if (discussion) {
        document.getElementById("discussion").value = discussion.text;
      } else {
        console.log("Discussion does not exist");
      }
    }
  );

  // Modify the database discussion value
  document
    .getElementById("discussion")
    .addEventListener("input", handleDiscussionInput);

  // Unsubscribe the listener when the discussion panel is closed
  document.getElementById("discussion-close").onclick = () => {
    handleCloseDiscussion(unsubscribe);
  };
  document.getElementById("discussion-background").onclick = () => {
    handleCloseDiscussion(unsubscribe);
  };
}

function handleDiscussionInput(event) {
  databaseFunctions.storeDiscussion(CITY, ISSTAGE, event.target.value);
}

function handleCloseDiscussion(unsubscribe) {
  document.getElementById("discussion-container").classList.remove("selected");
  document.getElementById("discussion-background").classList.remove("selected");
  document.getElementById("discussion").value = "";

  // Unsubscribe the listener
  unsubscribe();

  // Remove the event listener and update the flag
  document
    .getElementById("discussion")
    .removeEventListener("input", handleDiscussionInput);
}
