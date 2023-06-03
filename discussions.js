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
      document.getElementById("discussion-info")

      const discussionTextArea = document.getElementById("discussion");
      const cursorPosition = discussionTextArea.selectionStart;
      const oldText = discussionTextArea.value;

      // Update disucssion text
      discussionTextArea.value = discussion.text;

      // Restore the cursor position
      const firstDifferenceIndex = findFirstDifferenceIndex(
        oldText,
        discussionTextArea.value
      );

      if (firstDifferenceIndex < cursorPosition) {
        const adjustedCursorPosition =
          cursorPosition + discussionTextArea.value.length - oldText.length;
        discussionTextArea.setSelectionRange(
          adjustedCursorPosition,
          adjustedCursorPosition
        );
      } else {
        discussionTextArea.setSelectionRange(cursorPosition, cursorPosition);
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

function findFirstDifferenceIndex(oldText, newText) {
  const minLength = Math.min(oldText.length, newText.length);

  for (let i = 0; i < minLength; i++) {
    if (oldText[i] !== newText[i]) {
      return i;
    }
  }

  return minLength;
}
