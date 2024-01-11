// import * as databaseFunctions from "./database.js";

import { changeCursorPosition } from "./utils";
import {
  type DatabaseFuncionOpenDiscussion,
  type DatabaseFuncionStoreDiscussion,
} from "./types";

export default class DiscussionHandler {
  private readonly databaseFunctionOpenDiscussion: DatabaseFuncionOpenDiscussion;
  private readonly databaseFunctionStoreDiscussion: DatabaseFuncionStoreDiscussion;
  private city: string;
  private group: string;

  constructor(
    databaseFunctionOpen: DatabaseFuncionOpenDiscussion,
    databaseFunctionStore: DatabaseFuncionStoreDiscussion
  ) {
    this.databaseFunctionOpenDiscussion = databaseFunctionOpen;
    this.databaseFunctionStoreDiscussion = databaseFunctionStore;

    // Bind the input handler to the class, needed to removeEventListener
    this.inputHandler = this.inputHandler.bind(this);
  }

  openDiscussionView(city: string, group: string): void {
    this.city = city;
    this.group = group;

    document.getElementById("discussion-container")?.classList.add("selected");
    document
      .getElementById("discussion-container")
      ?.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    document.getElementById("discussion-background")?.classList.add("selected");

    // Change title
    const discussionTitleElement = document.getElementById("discussion-title");
    if (discussionTitleElement === null) {
      console.error("Missing DOM element (discussion title)");
      return;
    }
    discussionTitleElement.innerText = `${this.city} - ${this.group}`;

    document
      .getElementById("discussion-close")
      ?.classList.add(this.group.toLowerCase().replace(" ", "-"));

    // Listen to changes on the text and update area
    const discussionTextArea = document.getElementById(
      "discussion"
    ) as HTMLTextAreaElement;

    const unsubscribe = this.databaseFunctionOpenDiscussion(
      this.city,
      this.group,
      (error: Error | null, discussionText: string) => {
        if (error === null) {
          const oldText = discussionTextArea.value;
          discussionTextArea.value = discussionText;
          changeCursorPosition(discussionTextArea, oldText, discussionText);
        }
      }
    );

    // Modify the database discussion value when user types
    discussionTextArea.addEventListener("input", this.inputHandler);

    // Unsubscribe the listener when the discussion panel is closed
    document
      .getElementById("discussion-close")
      ?.addEventListener("click", () => {
        document
          .getElementById("discussion-container")
          ?.classList.remove("selected");
        document
          .getElementById("discussion-background")
          ?.classList.remove("selected");
        discussionTextArea.value = "";

        unsubscribe();

        discussionTextArea.removeEventListener("input", this.inputHandler);
      });
  }

  inputHandler = (): void => {
    const text = (document.getElementById("discussion") as HTMLTextAreaElement)
      .value;
    this.databaseFunctionStoreDiscussion(this.city, this.group, text);
  };
}
