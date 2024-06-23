import DarkModeHandler from "./darkmode";

export default class NavBarHandler {
  private readonly cardsRoot: HTMLElement;
  private readonly imagesPath: string = "/assets/images/";
  private readonly CLASSNAME_SHOW_SOCIALS = "show-socials";
  private readonly CLASSNAME_SHOW_PROJECTS = "show-projects";

  constructor() {
    const cardsRoot = document.getElementById("main-container");
    if (cardsRoot === null) {
      console.error("Missing DOM element");
      return;
    }
    this.cardsRoot = cardsRoot;
  }

  init(): void {
    this.setupDarkMode();
    this.setupMenu();
    this.filterMenu("all");
  }

  private setupDarkMode(): void {
    const darkModeHandler = new DarkModeHandler();
    darkModeHandler.init();

    const darkModeButton = document.getElementById("dark-mode-button");
    darkModeButton?.addEventListener("click", () => {
      darkModeHandler.switchDarkMode();
    });
  }

  private filterMenu(filter: string): void {
    document.getElementById("nav-button-all")?.classList.remove("active");
    document.getElementById("nav-button-socials")?.classList.remove("active");
    document.getElementById("nav-button-projects")?.classList.remove("active");

    if (filter === "all") {
      document.getElementById("nav-button-all")?.classList.add("active");
      this.cardsRoot.classList.add(this.CLASSNAME_SHOW_SOCIALS);
      this.cardsRoot.classList.add(this.CLASSNAME_SHOW_PROJECTS);
    } else if (filter === "socials") {
      document.getElementById("nav-button-socials")?.classList.add("active");
      this.cardsRoot.classList.add(this.CLASSNAME_SHOW_SOCIALS);
      this.cardsRoot.classList.remove(this.CLASSNAME_SHOW_PROJECTS);
    } else if (filter === "projects") {
      document.getElementById("nav-button-projects")?.classList.add("active");
      this.cardsRoot.classList.remove(this.CLASSNAME_SHOW_SOCIALS);
      this.cardsRoot.classList.add(this.CLASSNAME_SHOW_PROJECTS);
    }
  }

  private setupMenu(): void {
    const allButton = document.getElementById("nav-button-all");
    const socialsButton = document.getElementById("nav-button-socials");
    const projectsButton = document.getElementById("nav-button-projects");

    allButton?.addEventListener("click", () => {
      this.filterMenu("all");
    });
    socialsButton?.addEventListener("click", () => {
      this.filterMenu("socials");
    });
    projectsButton?.addEventListener("click", () => {
      this.filterMenu("projects");
    });
  }
}
