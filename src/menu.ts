import { createDropDown } from "./utils";
import { type MapFunctionChangeGroup } from "./types";

export default class MenuHandler {
  private readonly selector: HTMLSelectElement;
  private readonly mapFunctionChangeGroup: MapFunctionChangeGroup;

  constructor(mapFunction: MapFunctionChangeGroup) {
    this.mapFunctionChangeGroup = mapFunction;

    // Create and add the dropdown menu
    const rootDiv = document.getElementById("menu");
    if (rootDiv === null) {
      console.error("Missing DOM element");
      return;
    }
    this.selector = createDropDown(rootDiv, "menu-group", "", "PFE");
  }

  initMenuEvents(): void {
    this.selector.addEventListener("change", () => {
      this.mapFunctionChangeGroup(this.selector.value);
    });
    this.selector.dispatchEvent(new Event("change"));
  }
}
