import "./assets/styles/index.css";

import MenuHandler from "./menu";

window.addEventListener("DOMContentLoaded", () => {
  const _menu = new MenuHandler();
  _menu.init()
});
