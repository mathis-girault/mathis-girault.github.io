import "./assets/styles/index.css";

import CardsHandler from "./cards";
import NavBarHandler from "./navbar";

window.addEventListener("DOMContentLoaded", () => {
  const _cards = new CardsHandler();
  _cards.init();
  const _navbar = new NavBarHandler();
  _navbar.init();
});
