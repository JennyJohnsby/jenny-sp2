import { login } from "../../api/auth/login.js";
import { displayBanner } from "../../utilities/banners.js";
import { authGuard } from "../../utilities/authGuard";

// Ensure the user is not logged in before accessing the login page
authGuard({ redirectIfAuthenticated: true });

// Utility function for input validation
function isValidInput(input, message) {
  if (!input.validity.valid) {
    displayBanner(message, "error");
    input.classList.add("invalid");
    return false;
  }
  input.classList.remove("invalid");
  return true;
}

// Form handling code for login
export async function onLogin(event) {
  event.preventDefault(); // Prevent default form submission

  // Get email and password input elements
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");

  // Validate inputs
  if (!isValidInput(emailInput, "Please enter a valid email address.")) return;
  if (!isValidInput(passwordInput, "Password must be at least 8 characters."))
    return;

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    // Call the login API
    const response = await login({ email, password });

    const token = response.accessToken;
    const user = {
      name: response.name,
      email: response.email,
      bio: response.bio,
      avatar: response.avatar,
      banner: response.banner,
    };

    if (token) {
      // Store token and user data in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Display success banner
      displayBanner(`Welcome back, ${response.name}!`, "success");

      // Redirect to homepage after a short delay
      setTimeout(() => {
        window.location.pathname = "/"; // Redirect to homepage
      }, 3000); // Adjust the delay as needed
    } else {
      throw new Error("Login successful, but no token was returned.");
    }
  } catch (error) {
    // Log the error and display an error message to the user
    console.error("Login failed:", error);
    displayBanner(
      error.message || "Invalid login credentials. Please try again.",
      "error",
    );
  }
}
