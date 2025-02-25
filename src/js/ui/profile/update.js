import { updateProfile } from "../../api/profile/update.js"; // Importing the function to update the profile
import { displayBanner } from "../../utilities/banners.js"; // Assuming you have a utility to display banners

export async function onUpdateProfile(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const bio = formData.get("bio")?.trim(); // Get the bio from the form
  const avatarUrl = formData.get("avatarUrl")?.trim(); // Get the avatar URL
  const avatarAlt = formData.get("avatarAlt")?.trim(); // Get the avatar alt text
  const bannerUrl = formData.get("bannerUrl")?.trim(); // Get the banner URL
  const bannerAlt = formData.get("bannerAlt")?.trim(); // Get the banner alt text

  // Construct avatar and banner objects if URLs are provided
  const avatar = avatarUrl ? { url: avatarUrl, alt: avatarAlt || "" } : null;
  const banner = bannerUrl ? { url: bannerUrl, alt: bannerAlt || "" } : null;

  // Create the profile data object
  const profileData = { bio, avatar, banner };

  try {
    // Call the updateProfile function to send the data to the API
    const updatedProfile = await updateProfile(profileData);
    console.log("Profile updated successfully:", updatedProfile);

    // Display success banner
    displayBanner("Profile updated successfully!", "success");

    // Navigate back to the profile page after 2 seconds
    setTimeout(() => {
      window.location.href = "/profile/"; // Adjust the URL if needed
    }, 2000);
  } catch (error) {
    console.error("Error updating profile:", error);

    // Handle specific errors based on status codes or messages
    if (error.message.includes("400")) {
      displayBanner("Invalid data provided. Please check your input.", "error");
    } else if (error.message.includes("401")) {
      displayBanner("Unauthorized. Please log in again.", "error");
    } else if (error.message.includes("404")) {
      displayBanner("Profile not found. It may have been deleted.", "error");
    } else if (error.message.includes("500")) {
      displayBanner("Server error. Please try again later.", "error");
    } else {
      displayBanner(error.message || "An unexpected error occurred.", "error");
    }
  }
}
