import { registerUser } from "../../api/auth/register";
import { displayBanner } from "../../utilities/banners";
import { authGuard } from "../../utilities/authGuard";

// Ensure the user is redirected if already authenticated
authGuard({ redirectIfAuthenticated: true });

export async function onRegister(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  // Prepare the user data
  const userData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    bio: formData.get("bio") || "", // Default to empty string
    venueManager: formData.has("venueManager"),
  };

  // Handle avatar URL and alt text
  const avatarUrl = formData.get("avatarUrl");
  if (avatarUrl) {
    userData.avatar = {
      url: avatarUrl,
      alt: formData.get("avatarAlt") || "", // Default alt text to empty string
    };
  }

  // Handle banner URL and alt text
  const bannerUrl = formData.get("bannerUrl");
  if (bannerUrl) {
    userData.banner = {
      url: bannerUrl,
      alt: formData.get("bannerAlt") || "", // Default alt text to empty string
    };
  }

  try {
    const response = await registerUser(userData);
    console.log("Registration successful:", response);

    // Display a success banner
    displayBanner("Registration successful! Redirecting to login...", "success");

    // Redirect to login page after a short delay
    setTimeout(() => {
      window.location.pathname = "/auth/login/";
    }, 3000); // Adjust the delay as needed
  } catch (error) {
    console.error("Error during registration:", error);

    // Display an error banner
    displayBanner(error.message || "An error occurred during registration.", "error");
  }
}