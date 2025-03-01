import { API_KEY } from "../constants";

export async function updateProfile({ bio, avatar, banner, avatarFile }) {
  // Get user info from localStorage
  const userInLocalStorage = JSON.parse(localStorage.getItem("currentUser"));
  const username = userInLocalStorage ? userInLocalStorage.name : null;
  const token = localStorage.getItem("authToken");

  if (!username || !token) {
    throw new Error("No username or token found in localStorage.");
  }

  // Define the API URL for updating the profile
  const url = `https://v2.api.noroff.dev/auction/profiles/${username}`;

  // Check if at least one of the fields (bio, avatar, banner, or avatarFile) is provided
  if (!bio && !avatar && !banner && !avatarFile) {
    throw new Error(
      "At least one of bio, avatar, banner, or avatarFile must be provided.",
    );
  }

  // Create FormData if avatarFile is provided
  let formData = new FormData();
  if (avatarFile) {
    // Check file type or size here if needed
    if (!["image/jpeg", "image/png"].includes(avatarFile.type)) {
      throw new Error("Invalid file type. Please upload a JPEG or PNG image.");
    }
    formData.append("avatar", avatarFile); // Append the avatar file to the form data
  }

  if (bio) {
    formData.append("bio", bio); // Append bio if provided
  }

  if (avatar?.url) {
    formData.append("avatarUrl", avatar.url); // Append avatar URL if provided
  }

  if (banner?.url) {
    formData.append("bannerUrl", banner.url); // Append banner URL if provided
  }

  try {
    let response;
    if (avatarFile) {
      // If there's an avatar file, send it as FormData
      response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY, // Use the imported API key
        },
        body: formData, // Send the formData (with the avatar file)
      });
    } else {
      // If no avatar file, send the profile data as JSON
      response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY, // Use the imported API key
        },
        body: JSON.stringify({
          bio,
          ...(avatar?.url ? { avatar } : {}),
          ...(banner?.url ? { banner } : {}),
        }), // Send profile data as a JSON string
      });
    }

    // If the response is not OK, throw an error
    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`Error: ${errorDetails.message || response.statusText}`);
    }

    // Return the updated profile data
    const updatedProfile = await response.json();
    if (!updatedProfile) {
      throw new Error("Profile update failed: No response data.");
    }

    return updatedProfile;
  } catch (error) {
    console.error("Failed to update profile:", error.message || error);
    throw error;
  }
}
