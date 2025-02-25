import { readProfile } from "../../api/profile/read.js";
import { updateProfile } from "../../api/profile/update.js";
import { authGuard } from "../../utilities/authGuard";
import { onLogout } from "../../ui/auth/logout.js";
import { displayBanner } from "../../utilities/banners.js";
import { fetchUserListings } from "../../api/profile/userListings.js";

authGuard();

async function showProfile() {
  const profileDiv = document.getElementById("profile");
  profileDiv.innerHTML = "<p>Loading profile...</p>";

  try {
    const profile = await readProfile();

    if (!profile) {
      profileDiv.innerHTML =
        "<p>Error fetching your profile. Please try again later.</p>";
      return;
    }

    profileDiv.innerHTML = `
      <div id="profile-view">
        <div class="profile-banner">
          <img src="${profile.banner?.url || "public/images/banner-placeholder.jpg"}" alt="User banner" class="profile-banner-image" />
        </div>

        <div class="profile-header">
          <img src="${profile.avatar?.url || "public/images/avatar-placeholder.png"}" alt="User avatar" class="profile-avatar" />
          <div class="profile-details">
            <h1 class="profile-name">${profile.name || "User Name"}</h1>
            <p class="profile-email"><strong>Email:</strong> ${profile.email || "Not provided"}</p>
            <p class="profile-bio">${profile.bio || "No bio available"}</p>
            <p class="profile-credits"><strong>Total Credit:</strong> ${profile.credits || 0}</p>
            <p class="profile-listings"><strong>Total Listings:</strong> ${profile._count?.listings || 0}</p>
            <p class="profile-wins"><strong>Auctions Won:</strong> ${profile._count?.wins || 0}</p>
            <p class="profile-venue">${profile.venueManager ? "Venue Manager" : "Regular User"}</p>
          </div>
        </div>

        <div id="profile-update-form">
          <h2>Update Profile</h2>
          <form id="update-profile-form">
            <label for="bio">Bio:</label>
            <textarea id="bio" name="bio">${profile.bio || ""}</textarea>
            <label for="avatar-url">Avatar URL:</label>
            <input type="url" id="avatar-url" name="avatar-url" value="${profile.avatar?.url || ""}" />
            <label for="banner-url">Banner URL:</label>
            <input type="url" id="banner-url" name="banner-url" value="${profile.banner?.url || ""}" />
            <button type="submit" class="update-button">Update Profile</button>
          </form>
        </div>

        <button id="create-listing-button" class="create-listing-button">Create Listing</button>
        <button id="logout-button" class="logout-button">Logout</button>

        <div id="user-listings" class="mt-8">
          <h2 class="text-2xl font-semibold">User Listings</h2>
          <div id="listings-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6"></div>
        </div>
      </div>
    `;

    document
      .getElementById("logout-button")
      .addEventListener("click", onLogout);
    document
      .getElementById("update-profile-form")
      .addEventListener("submit", handleProfileUpdate);
    document
      .getElementById("create-listing-button")
      .addEventListener(
        "click",
        () => (window.location.href = "../../listings/create/"),
      );

    try {
      const listings = await fetchUserListings();
      console.log("Fetched Listings:", listings);
      displayListings(listings);
    } catch (error) {
      console.error("Error fetching user listings:", error);
      displayBanner(
        "Error fetching listings. Please try again later.",
        "error",
      );
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    profileDiv.innerHTML =
      "<p>Unable to load your profile. Please try again later.</p>";
  }
}

async function handleProfileUpdate(event) {
  event.preventDefault();

  const bio = document.getElementById("bio").value;
  const avatarUrl = document.getElementById("avatar-url").value;
  const bannerUrl = document.getElementById("banner-url").value;

  const profileData = {
    bio,
    avatar: { url: avatarUrl || "", alt: "User Avatar" },
    banner: { url: bannerUrl || "", alt: "User Banner" },
  };

  try {
    const updatedProfile = await updateProfile(profileData);
    if (!updatedProfile) throw new Error("Failed to update profile.");

    document.querySelector(".profile-avatar").src =
      updatedProfile.avatar?.url || "public/images/avatar-placeholder.png";
    document.querySelector(".profile-banner-image").src =
      updatedProfile.banner?.url || "public/images/banner-placeholder.jpg";
    document.querySelector(".profile-bio").textContent = updatedProfile.bio;
    document.querySelector(".profile-credits").textContent =
      `Total Credit: ${updatedProfile.credits || 0}`;

    displayBanner("Profile updated successfully!", "success");
  } catch (error) {
    console.error("Error updating profile:", error);
    displayBanner("Error updating profile. Please try again.", "error");
  }
}

function displayListings(listings) {
  const container = document.getElementById("listings-container");
  container.innerHTML = listings.length
    ? listings
        .map(
          ({ id, title, description, media }) => `
    <div class="listing-item" onclick="window.location.href='/listings/?id=${id}'">
      <img src="${media?.[0]?.url || "public/images/listing-placeholder.jpg"}" alt="${title}" class="listing-image" />
      <h3>${title || "No title"}</h3>
      <p>${description || "No description available"}</p>
    </div>
  `,
        )
        .join("")
    : "<p>No listings found.</p>";
}

showProfile();
