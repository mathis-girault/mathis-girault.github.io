export default class DarkModeHandler {
  private readonly DARK_MODE_CLASS = "dark-mode";
  private readonly DARK_MODE_KEY = "dark-mode-enabled";
  private isDarkMode: boolean;
  private readonly lightIcon: HTMLElement;
  private readonly darkIcon: HTMLElement;

  constructor() {
    const lightIcon = document.getElementById("light-icon");
    const darkIcon = document.getElementById("dark-icon");
    if (lightIcon === null || darkIcon === null) {
      console.error("Missing DOM element");
      return;
    }
    this.lightIcon = lightIcon;
    this.darkIcon = darkIcon;
  }

  init(): void {
    this.loadDarkModePreference();
    this.toggleDarkMode(this.isDarkMode);
  }

  private enableDarkMode(): void {
    document.body.classList.add(this.DARK_MODE_CLASS);
    this.lightIcon.style.display = "none";
    this.darkIcon.style.display = "block";
    localStorage.setItem(this.DARK_MODE_KEY, "true");
  }

  private disableDarkMode(): void {
    document.body.classList.remove(this.DARK_MODE_CLASS);
    this.lightIcon.style.display = "block";
    this.darkIcon.style.display = "none";
    localStorage.setItem(this.DARK_MODE_KEY, "false");
  }

  private loadDarkModePreference(): void {
    const darkModeEnabled = localStorage.getItem(this.DARK_MODE_KEY) === "true";
    this.isDarkMode = darkModeEnabled;
  }

  private toggleDarkMode(darkMode: boolean): void {
    this.isDarkMode = darkMode;
    if (darkMode) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }
  }

  switchDarkMode(): void {
    this.toggleDarkMode(!this.isDarkMode);
  }
}
