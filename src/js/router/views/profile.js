import { readProfile } from "../../api/profile/read.js";
import { updateProfile } from "../../api/profile/update.js"; // Import the function to update profile
import { authGuard } from "../../utilities/authGuard";
import { onLogout } from "../../ui/auth/logout.js";
import { displayBanner } from "../../utilities/banners.js"; // Import displayBanner for feedback

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
              <!-- Displaying the total credit -->
              <p class="profile-credits"><strong>Total Credit:</strong> ${profile.credits || 0}</p>
            </div>
          </div>

          <!-- Profile Update Form -->
          <div id="profile-update-form">
            <h2>Update Profile</h2>
            
            <form id="update-profile-form">
              <div>
                <label for="bio">Bio:</label>
                <textarea id="bio" name="bio">${profile.bio || ""}</textarea>
              </div>
              <div>
                <label for="avatar-url">Avatar URL:</label>
                <input type="url" id="avatar-url" name="avatar-url" value="${profile.avatar?.url || ""}" />
              </div>
              <div>
                <label for="banner-url">Banner URL:</label>
                <input type="url" id="banner-url" name="banner-url" value="${profile.banner?.url || ""}" />
              </div>
              <div>
                <label for="avatar-file">Upload Avatar (Optional):</label>
                <input type="file" id="avatar-file" name="avatar-file" />
              </div>
              <button type="submit" class="update-button">Update Profile</button>
            </form>
          </div>

          <!-- Logout Button -->
          <button id="logout-button" class="logout-button">Logout</button>
        </div>
      `;

      // Add the event listener to the logout button
      const logoutButton = document.getElementById("logout-button");
      if (logoutButton) {
        logoutButton.addEventListener("click", onLogout);
      }

      // Add the event listener for the profile update form
      const updateForm = document.getElementById("update-profile-form");
      updateForm.addEventListener("submit", handleProfileUpdate);
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

// Function to handle profile update form submission
async function handleProfileUpdate(event) {
  event.preventDefault(); // Prevent the default form submission

  const bio = document.getElementById("bio").value;
  const avatarUrl = document.getElementById("avatar-url").value;
  const bannerUrl = document.getElementById("banner-url").value;

  // Create an object to hold the updated profile data
  const profileData = {
    bio,
    avatar: {
      url: avatarUrl || "", // Avatar URL
      alt: "User Avatar", // Optional alt text for the avatar
    },
    banner: {
      url: bannerUrl || "", // Banner URL
      alt: "User Banner", // Optional alt text for the banner
    },
  };

  // Update profile data via the API
  try {
    const updatedProfile = await updateProfile(profileData); // Call the updateProfile function
    if (updatedProfile) {
      console.log("Profile updated successfully!");

      // Update the UI with the new profile data
      document.querySelector(".profile-avatar").src =
        updatedProfile.avatar?.url || "public/images/avatar-placeholder.png";
      document.querySelector(".profile-banner-image").src =
        updatedProfile.banner?.url || "public/images/banner-placeholder.jpg";
      document.querySelector(".profile-name").textContent = updatedProfile.name;
      document.querySelector(".profile-bio").textContent = updatedProfile.bio;
      document.querySelector(".profile-credits").textContent =
        `Total Credit: ${updatedProfile.credits || 0}`;

      // Optionally display success message
      displayBanner("Profile updated successfully!", "success");
    } else {
      console.error("Failed to update profile.");
      displayBanner("Failed to update profile. Please try again.", "error");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    displayBanner("Error updating profile. Please try again.", "error");
  }
}

// Call the function to display the profile
showProfile();
