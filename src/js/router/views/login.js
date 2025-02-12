import { onLogin } from "../../ui/auth/login"; // Import the onLogin function from ui/auth/login.js

// Access the form element by its name
const form = document.forms.login;

// Add an event listener to the form for the 'submit' event
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission

  // Call the onLogin function, passing in the form data
  onLogin(event); // This will handle the login logic as described
});
