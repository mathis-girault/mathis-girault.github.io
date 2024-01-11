import "./index.css";
import Database from "./database";
import MapManager from "./map";
import MenuHandler from "./menu";
import DiscussionHandler from "./discussion";
import { FormHandler } from "./form";
import { listCategories } from "./utils";
import {
  type MapFunctionAddUser,
  type DatabaseFuncionOpenDiscussion,
  type DatabaseFuncionStoreDiscussion,
  type DatabaseFunctionAddUser,
  type MapFunctionChangeGroup,
  type DiscussionViewHandler,
} from "./types";

class Main {
  private readonly map: MapManager;
  private readonly database: Database;
  private readonly form: FormHandler;
  private readonly menu: MenuHandler;
  private readonly discussion: DiscussionHandler;

  constructor() {
    // Create all classes with bindinds
    this.map = new MapManager();
    this.database = new Database(
      this.map.registerNewPerson.bind(this.map) as MapFunctionAddUser
    );
    this.discussion = new DiscussionHandler(
      this.database.openDiscussion.bind(
        this.database
      ) as DatabaseFuncionOpenDiscussion,
      this.database.storeDiscussion.bind(
        this.database
      ) as DatabaseFuncionStoreDiscussion
    );
    this.form = new FormHandler(
      this.database.addUser.bind(this.database) as DatabaseFunctionAddUser
    );
    this.menu = new MenuHandler(
      this.map.changeGroup.bind(this.map) as MapFunctionChangeGroup
    );

    this.map.setDiscussionViewHandler(
      this.discussion.openDiscussionView.bind(
        this.discussion
      ) as DiscussionViewHandler
    );
  }

  init(): void {
    this.database
      .initDB()
      .then(() => {
        this.map.changeGroup(listCategories[0]);
        this.form.initForm();
        this.menu.initMenuEvents();
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const _main = new Main();
  _main.init();
});

// Function to init the listeners for the menu items
// function initMenuEvents() {

//   // Same on mobile devices
//   const stageButton = document.getElementById("mobile-stage");
//   const semester1Button = document.getElementById("mobile-semester1");
//   const selectedMarker = document.querySelector(".selected-marker");

//   stageButton.onclick = () => {
//     stageButton.classList.add("selected");
//     semester1Button.classList.remove("selected");
//     selectedMarker.style.transform = "translateX(0%)";
//     mapFunctions.displayMarkerGroup(true);
//   };

//   semester1Button.onclick = () => {
//     stageButton.classList.remove("selected");
//     semester1Button.classList.add("selected");
//     selectedMarker.style.transform = "translateX(100%)";
//     mapFunctions.displayMarkerGroup(false);
//   };

//   stageButton.dispatchEvent(new Event("click"));
// }
