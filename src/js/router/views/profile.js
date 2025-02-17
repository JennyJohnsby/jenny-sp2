import { readProfile } from "../../api/profile/read.js";
import { authGuard } from "../../utilities/authGuard";

// Ensure the user is logged in before proceeding
authGuard();

// Function to display the user's profile
async function showProfile() {
  const profileDiv = document.getElementById("profile");

  // Show loading indicator while fetching data
  profileDiv.innerHTML = "<p>Loading profile...</p>";

  try {
    const profile = await readProfile(); // Fetch profile data

    // Check if profile data exists
    if (profile) {
      profileDiv.innerHTML = `
        <div id="profile-view">
          <div class="profile-banner">
            <img 
              src="${profile.banner?.url || "public/images/banner-placeholder.jpg"}" 
              alt="${profile.banner?.alt || "User banner"}" 
              class="profile-banner-image"
            />
          </div>
          <div class="profile-header">
            <img 
              src="${profile.avatar?.url || "public/images/avatar-placeholder.png"}" 
              alt="${profile.avatar?.alt || "User avatar"}" 
              class="profile-avatar"
            />
            <div class="profile-details">
              <h1 class="profile-name">${profile.name || "User Name"}</h1>
              <p class="profile-bio">${profile.bio || "No bio available"}</p>
              <p class="profile-email"><strong>Email:</strong> ${profile.email || "Not provided"}</p>
              <p class="profile-posts"><strong>Posts:</strong> ${profile._count?.posts || 0}</p>
              <p class="profile-venue">${profile.venueManager ? "Venue Manager" : "Regular User"}</p>
            </div>
          </div>
        </div>
      `;
    } else {
      profileDiv.innerHTML =
        "<p>Error fetching your profile. Please try again later.</p>";
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    profileDiv.innerHTML =
      "<p>Unable to load your profile. Please try again later.</p>";
  }
}

// Call the function to display the profile
showProfile();
