import menuItems from "./config.json"

interface CardData {
  title: string,
  URL: string,
  image: string  
}

export default class MenuHandler {
  private readonly root: HTMLElement
  private readonly imagesPath: string = "/assets/images/"

  constructor() {
    const rootDiv = document.getElementById("menu-container");
    if (!rootDiv) {
      console.error("Missing DOM element");
      return;
    }
    this.root = rootDiv
  }

  init(): void {
    const websites = menuItems.pages

    websites.forEach((card: CardData) => {
      this.createMenuCard(card)
    }); 
  }

  createMenuCard(card: CardData): void {
    const cardTemplate = document.getElementById('card-template') as HTMLTemplateElement;

    const clone = document.importNode(cardTemplate.content, true);
    const cardTitle = clone.querySelector('.card-title') as HTMLElement;
    const cardIcon = clone.querySelector('.card-icon') as HTMLImageElement;
    const cardLink = clone.querySelector('.card-button') as HTMLButtonElement;

    cardTitle.textContent = card.title;
    cardIcon.src = this.imagesPath + card.image
    cardLink.addEventListener("click", () => location.href = card.URL)

    this.root.appendChild(clone);
  }
}
