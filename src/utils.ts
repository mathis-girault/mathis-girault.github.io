import * as L from "leaflet";
import curConfig from "./config.json";
import { type Config } from "./types";

export const config = curConfig as Config;
export const listCategories = Object.keys(config.categories);

export async function getPosFromAdress(text: string): Promise<L.Point> {
  const baseUrl = "https://nominatim.openstreetmap.org/search";

  return await new Promise((resolve, reject) => {
    fetch(`${baseUrl}?format=json&q=${text}`)
      .then(async (response) => await response.json())
      .then((result) => {
        if (result.length > 0 && typeof result[0].lat === "string") {
          const pos = new L.Point(
            parseFloat(result[0].lat as string),
            parseFloat(result[0].lon as string)
          );
          resolve(pos);
        } else {
          reject(new Error("No results found for the provided address."));
        }
      })
      .catch((error) => {
        console.log("Error: ", error);
        reject(error);
      });
  });
}

export const iconOptions = {
  iconSize: [25, 35],
  iconAnchor: new L.Point(11, 30),
};

export function getIconHtml(group: string, number: string): string {
  const iconUri =
    config.UriInfos.base +
    config.UriInfos.prefix +
    config.categories[group].color +
    (number === "" ? "" : config.UriInfos.extention) +
    config.UriInfos.suffix;

  return `<img src="${iconUri}" width="${iconOptions.iconSize[0]}" height="${iconOptions.iconSize[1]}"/>
	<div class="marker-number">${number}</div>`;
}

export function createDropDown(
  rootDiv: HTMLElement,
  id: string,
  labelText: string,
  defaultSelected: string
): HTMLSelectElement {
  // Create label
  const label = document.createElement("label");
  label.htmlFor = id;
  label.textContent = labelText;

  // Create dropdown
  const select = document.createElement("select");
  select.id = id;
  select.name = id;
  select.required = true;

  listCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.text = category;

    category === defaultSelected && (option.selected = true);

    select.appendChild(option);
  });

  rootDiv.appendChild(label);
  rootDiv.appendChild(select);

  return select;
}

export function createMenuSlider(
  rootDiv: HTMLElement,
  menuItems: HTMLElement[],
  defaultSelected: string
): void {
  for (const group of listCategories) {
    // Create a new div
    const newDiv = document.createElement("div");
    newDiv.classList.add("menu-item");
    group === defaultSelected && newDiv.classList.add("selected");
    newDiv.id = `mobile-menu-${group.replace(" ", "-").toLowerCase()}`;
    newDiv.textContent = group;

    rootDiv.appendChild(newDiv);
    menuItems.push(newDiv);
  }
}

export function changeCursorPosition(
  textarea: HTMLTextAreaElement,
  oldText: string,
  newText: string
): void {
  const cursorPosition = textarea.selectionStart;

  // Restore the cursor position
  const firstDifferenceIndex = findFirstDifferenceIndex(oldText, newText);

  let adjustedCursorPosition = cursorPosition;

  if (firstDifferenceIndex < cursorPosition) {
    adjustedCursorPosition = cursorPosition + newText.length - oldText.length;
  }

  textarea.setSelectionRange(adjustedCursorPosition, adjustedCursorPosition);
}

function findFirstDifferenceIndex(oldText: string, newText: string): number {
  const minLength = Math.min(oldText.length, newText.length);

  for (let i = 0; i < minLength; i++) {
    if (oldText[i] !== newText[i]) {
      return i;
    }
  }

  return minLength;
}
