import { API_AUTH_REGISTER } from "../constants"; // Ensure this constant holds the correct registration URL
import { onRegister } from "../../ui/auth/register"; // Function that handles form submission
import { authGuard } from "../../utilities/authGuard.js"; // Handles authentication state

/**
 * Registers a new user with the provided details by sending a POST request
 * to the registration API endpoint.
 *
 * @param {Object} data - The registration data.
 * @param {string} data.name - The user's name (required).
 * @param {string} data.email - The user's email address (required).
 * @param {string} data.password - The user's password (required).
 * @param {string} [data.bio] - A brief biography of the user (optional).
 * @param {Object} [data.avatar] - The user's avatar information (optional).
 * @param {string} [data.avatar.url] - URL for the user's avatar image.
 * @param {string} [data.avatar.alt] - Alt text for the user's avatar image.
 * @param {Object} [data.banner] - The user's banner information (optional).
 * @param {string} [data.banner.url] - URL for the user's banner image.
 * @param {string} [data.banner.alt] - Alt text for the user's banner image.
 * @param {boolean} [data.venueManager] - Indicates if the user is a venue manager (optional).
 *
 * @returns {Promise<Object>} A promise that resolves to the user's registration response.
 * @throws {Error} Throws an error if the registration request fails.
 */
export async function registerUser(data) {
  try {
    // Send the POST request to register the user
    const response = await fetch(API_AUTH_REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Indicating that we are sending JSON data
      },
      body: JSON.stringify(data), // Send the registration data as JSON
    });

    // If the response is not successful (not in the 2xx range)
    if (!response.ok) {
      const errorDetails = await response.json(); // Parse error response
      console.error("Server error details:", errorDetails);

      // Extract the first error message if available, else provide a default message
      const message =
        errorDetails.errors?.[0]?.message || "Failed to register user";
      throw new Error(message); // Throw the error for further handling
    }

    // Return the successful registration response as JSON
    return await response.json();
  } catch (error) {
    console.error("Registration error:", error); // Log any errors encountered
    throw error; // Propagate the error for further handling
  }
}

// Event listener to run the code when the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Guard against unauthorized access or handle authentication state
  authGuard(true);

  // Ensure the form exists before attaching the submit event handler
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    // Attach the onRegister function to handle form submissions
    registerForm.addEventListener("submit", onRegister);
    console.log("Register form is now connected to onRegister");
  } else {
    console.error("Register form not found in the DOM");
  }
});
