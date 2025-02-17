/**
 * Updates an existing user profile by sending updated data to the API.
 *
 * @param {Object} params - The updated profile parameters.
 * @param {string} [params.bio] - The updated bio of the user (optional).
 * @param {Object} [params.avatar] - Updated avatar object containing URL and alt text (optional).
 * @param {string} [params.avatar.url] - The updated URL of the avatar image.
 * @param {string} [params.avatar.alt] - Updated alt text for the avatar image.
 * @param {Object} [params.banner] - Updated banner object containing URL and alt text (optional).
 * @param {string} [params.banner.url] - The updated URL of the banner image.
 * @param {string} [params.banner.alt] - Updated alt text for the banner image.
 * @param {File} [params.avatarFile] - The avatar file to upload (optional).
 * @returns {Promise<Object>} The updated profile data from the API.
 * @throws {Error} If the API request fails.
 */
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

  // Check if at least one of the fields (bio, avatar, or banner) is provided
  if (!bio && !avatar && !banner && !avatarFile) {
    throw new Error(
      "At least one of bio, avatar, banner, or avatarFile must be provided.",
    );
  }

  // Create FormData if avatarFile is provided
  let formData = new FormData();
  if (avatarFile) {
    formData.append("avatar", avatarFile); // Append the avatar file to the form data
  }

  // If no avatar file, use the URL provided in the avatar object
  const profileData = {
    bio: bio || "", // If bio is not provided, send an empty string
    ...(avatar?.url ? { avatar } : {}), // Include avatar if URL is provided
    ...(banner?.url ? { banner } : {}), // Include banner if URL is provided
  };

  try {
    let response;
    if (avatarFile) {
      // If there's an avatar file, send it as FormData
      response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
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
        },
        body: JSON.stringify(profileData), // Send profile data as a JSON string
      });
    }

    // If the response is not OK, throw an error
    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`Error: ${errorDetails.message || response.statusText}`);
    }

    // Return the updated profile data
    return await response.json();
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
}
