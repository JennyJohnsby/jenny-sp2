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

    // Dynamically update the profile information in the UI

    // Update avatar
    const avatarElement = document.querySelector(".profile-avatar");
    if (avatarElement) {
      avatarElement.src =
        updatedProfile.avatar?.url || "public/images/avatar-placeholder.png";
      avatarElement.alt = updatedProfile.avatar?.alt || "User Avatar";
    }

    // Update banner
    const bannerElement = document.querySelector(".profile-banner-image");
    if (bannerElement) {
      bannerElement.src =
        updatedProfile.banner?.url || "public/images/banner-placeholder.jpg";
      bannerElement.alt = updatedProfile.banner?.alt || "User Banner";
    }

    // Update bio
    const bioElement = document.querySelector(".profile-bio");
    if (bioElement) {
      bioElement.textContent = updatedProfile.bio || "No bio available";
    }

    // Update total credits (assuming it's part of the profile)
    const creditsElement = document.querySelector(".profile-credits");
    if (creditsElement) {
      creditsElement.textContent = `Total Credit: ${updatedProfile.credits || 0}`;
    }

    // Update profile type
    const profileTypeElement = document.querySelector(".profile-type");
    if (profileTypeElement) {
      profileTypeElement.textContent =
        updatedProfile.venueManager !== undefined
          ? updatedProfile.venueManager
            ? "Venue Manager"
            : "Regular User"
          : "User";
    }
  } catch (error) {
    console.error("Error updating profile:", error);

    // Handle specific errors based on status codes or messages
    displayBanner(error.message || "An unexpected error occurred.", "error");
  }
}
