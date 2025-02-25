import { API_AUTH_REGISTER } from "../constants";
import { onRegister } from "../../ui/auth/register";
import { authGuard } from "../../utilities/authGuard.js";

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
    const response = await fetch(API_AUTH_REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Server error details:", errorDetails);

      const message =
        errorDetails.errors?.[0]?.message || "Failed to register user";
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  authGuard(true);

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", onRegister);
    console.log("Register form is now connected to onRegister");
  } else {
    console.error("Register form not found in the DOM");
  }
});
