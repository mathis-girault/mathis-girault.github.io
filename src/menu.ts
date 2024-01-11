import { type MapFunctionChangeGroup } from "./types";
import { listCategories, createMenuSlider, createDropDown } from "./utils";

export default class MenuHandler {
  private readonly selector: HTMLSelectElement;
  private readonly mapFunctionChangeGroup: MapFunctionChangeGroup;
  private readonly defaultGroup: string = "PFE";
  private readonly menuItems: HTMLElement[] = [];
  private currentIndex: number;

  constructor(mapFunction: MapFunctionChangeGroup) {
    this.mapFunctionChangeGroup = mapFunction;

    // For Web Menu
    const webMenuRootDiv = document.getElementById("web-menu");
    if (webMenuRootDiv === null) {
      console.error("Missing DOM element");
      return;
    }
    this.selector = createDropDown(
      webMenuRootDiv,
      "menu-group",
      "",
      this.defaultGroup
    );

    // For Mobile Menu
    const mobileMenuRootDiv = document.getElementById("menu-items-container");
    if (mobileMenuRootDiv === null) {
      console.error("Missing DOM element");
      return;
    }
    createMenuSlider(mobileMenuRootDiv, this.menuItems, this.defaultGroup);
    this.currentIndex = listCategories.indexOf(this.defaultGroup);
  }

  initMenuEvents(): void {
    this.initMenuEventsWeb();
    this.initMenuEventsMobile();

    // Trigger to load default group
    this.mapFunctionChangeGroup(this.defaultGroup);
  }

  initMenuEventsWeb(): void {
    this.selector.addEventListener("change", () => {
      this.mapFunctionChangeGroup(this.selector.value);
    });
  }

  initMenuEventsMobile(): void {
    const leftArrow = document.getElementById("arrow-left");
    const rightArrow = document.getElementById("arrow-right");
    if (leftArrow === null || rightArrow === null) {
      console.error("Missing DOM element");
      return;
    }

    const arrowPressedHandler = (newIndex: number): void => {
      this.menuItems[this.currentIndex].classList.remove("selected");
      this.currentIndex = newIndex;
      this.menuItems[this.currentIndex].classList.add("selected");
      this.mapFunctionChangeGroup(listCategories[this.currentIndex]);
    };

    leftArrow.addEventListener("click", () => {
      const newIndex =
        (this.currentIndex - 1 + listCategories.length) % listCategories.length;
      this.menuItems[this.currentIndex].style.animation = "exit-right 0.5s";
      this.menuItems[newIndex].style.animation = "enter-left 0.5s";
      arrowPressedHandler(newIndex);
    });

    rightArrow.addEventListener("click", () => {
      const newIndex = (this.currentIndex + 1) % listCategories.length;
      this.menuItems[this.currentIndex].style.animation = "exit-left 0.5s";
      this.menuItems[newIndex].style.animation = "enter-right 0.5s";
      arrowPressedHandler(newIndex);
    });

    // Trigger to load default group
    this.mapFunctionChangeGroup(this.defaultGroup);
  }
}
