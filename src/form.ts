import { createDropDown } from "./utils";
import { type DatabaseFunctionAddUser } from "./types";

export class FormHandler {
  private readonly databaseFunctionAddUser: DatabaseFunctionAddUser;

  constructor(databaseFunction: DatabaseFunctionAddUser) {
    this.databaseFunctionAddUser = databaseFunction;
  }

  initForm(): void {
    const formContainer = document.getElementById("form-container");
    const addUserButton = document.getElementById("add-user");
    const addUserForm = document.getElementById("add-user-form");
    const addUserSubmit = document.getElementById("add-user-submit");
    const cancelButton = document.getElementById("annuler");
    const rootDiv = document.getElementById("form-drop-down");

    // Initialize events listeners
    if (
      formContainer === null ||
      addUserButton === null ||
      addUserForm === null ||
      addUserSubmit === null ||
      cancelButton === null ||
      rootDiv === null
    ) {
      console.error("Missing DOM elements");
      return;
    }

    // Create dropdown menu
    createDropDown(rootDiv, "form-group", "Pour quelle période ?", "PFE");

    // Add event listeners for the form
    addUserButton.addEventListener("click", () => {
      addUserForm.classList.add("selected");
      formContainer.style.zIndex = "1999";
    });

    cancelButton.addEventListener("click", () => {
      addUserForm.classList.remove("selected");
      formContainer.style.zIndex = "0";
    });

    formContainer.addEventListener("click", () => {
      addUserForm.classList.remove("selected");
      formContainer.style.zIndex = "0";
    });

    addUserSubmit.addEventListener("click", (event) => {
      this.handleSendForm(event);
      // this.formContainer.style.zIndex = "0";
    });

    addUserForm.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  handleSendForm(event: Event): void {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ '-]+$/;
    const cityRegex = /^[a-zA-Z0-9À-ÖØ-öø-ÿ ',.-]+$/;

    const form = document.getElementById("add-user-form") as HTMLFormElement;
    const formElements = form.elements;

    // Check if the form inputs are valid
    if (form.checkValidity()) {
      event.preventDefault();

      const name = (
        formElements.namedItem("name") as HTMLInputElement
      ).value.trim();
      const city = (
        formElements.namedItem("city") as HTMLInputElement
      ).value.trim();
      const group = (formElements.namedItem("form-group") as HTMLSelectElement)
        .value;

      // Test data validation
      if (!nameRegex.test(name)) {
        window.alert(
          "Invalid name input. Only alphabetic characters, spaces, and hyphens are allowed."
        );
        return;
      }
      if (!cityRegex.test(city)) {
        window.alert(
          "Invalid city input. Only alphanumeric characters, spaces, commas, periods, and hyphens are allowed."
        );
        return;
      }

      // Add the user to the database
      this.databaseFunctionAddUser(name, city, group);

      // Clear the form fields with delay
      setTimeout(() => {
        (formElements.namedItem("name") as HTMLInputElement).value = "";
        (formElements.namedItem("city") as HTMLInputElement).value = "";
        (formElements.namedItem("form-group") as HTMLSelectElement).value =
          "PFE";
      }, 100);

      // Close the form
      document.getElementById("add-user-form")?.classList.remove("selected");
    } else {
      // Handle invalid form inputs (display error messages, etc.)
      console.log("Invalid form inputs");
    }
  }
}
