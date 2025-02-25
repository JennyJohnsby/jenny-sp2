//Import the necessary function to handle form submission
import { onRegister } from "../../ui/auth/register";

// Get the registration form from the DOM
const form = document.getElementById("registerForm");

// Ensure the form exists before attaching the submit event listener
if (form) {
  // Attach the onRegister function to handle form submission
  form.addEventListener("submit", onRegister);
} else {
  // Log an error if the form is not found in the DOM
  console.error("Register form not found in the DOM.");
}
