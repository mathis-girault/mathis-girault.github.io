import menuItems from "./config.json";

interface CardData {
  title: string;
  URL: string;
  image: string;
}

export default class MenuHandler {
  private readonly root: HTMLElement;
  private readonly cardTemplate: HTMLTemplateElement;
  private readonly imagesPath: string = "/assets/images/";

  constructor() {
    const rootDiv = document.getElementById("menu-container");
    const cardTemplate = document.getElementById(
      "card-template"
    ) as HTMLTemplateElement;
    if (rootDiv === null || cardTemplate === null) {
      console.error("Missing DOM element");
      return;
    }
    this.root = rootDiv;
    this.cardTemplate = cardTemplate;
  }

  init(): void {
    const websites = menuItems.pages;

    websites.forEach((card: CardData) => {
      this.createMenuCard(card);
    });
  }

  createMenuCard(card: CardData): void {
    const clone = document.importNode(this.cardTemplate.content, true);
    const cardTitle = clone.querySelector(".card-title") as HTMLElement;
    const cardIcon = clone.querySelector(".card-icon") as HTMLImageElement;
    const cardLink = clone.querySelector(".card-button") as HTMLButtonElement;

    cardTitle.textContent = card.title;
    cardIcon.src = this.imagesPath + card.image;
    cardLink.addEventListener("click", () => (location.href = card.URL));

    this.root.appendChild(clone);
  }
}
