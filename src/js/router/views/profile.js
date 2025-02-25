import { readProfile } from "../../api/profile/read.js";
import { updateProfile } from "../../api/profile/update.js";
import { authGuard } from "../../utilities/authGuard";
import { onLogout } from "../../ui/auth/logout.js";
import { displayBanner } from "../../utilities/banners.js";
import { fetchUserListings } from "../../api/profile/userListings.js";

authGuard();

async function showProfile() {
  const profileDiv = document.getElementById("profile");
  profileDiv.innerHTML = "<p class='text-center'>Loading profile...</p>";

  try {
    const profile = await readProfile();

    if (!profile) {
      profileDiv.innerHTML =
        "<p class='text-center'>Error fetching your profile. Please try again later.</p>";
      return;
    }

    renderProfile(profile);
    setupEventListeners();

    try {
      const listings = await fetchUserListings();
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
      "<p class='text-center'>Unable to load your profile. Please try again later.</p>";
  }
}

function renderProfile(profile) {
  const profileDiv = document.getElementById("profile");
  profileDiv.innerHTML = `
    <div id="profile-view" >
      <div class="profile-banner">
        <img src="${profile.banner?.url || "public/images/banner-placeholder.jpg"}" alt="${profile.banner?.alt || "User banner"}" class="profile-banner-image"/>
      </div>
      <div class="profile-header">
        <img src="${profile.avatar?.url || "public/images/avatar-placeholder.png"}" alt="${profile.avatar?.alt || "User avatar"}" class="profile-avatar"/>
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
      
      <!-- Update Profile Button -->
      <button id="edit-profile-button" class="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300">
        Edit Profile
      </button>

      <!-- Profile Update Form (Initially hidden) -->
      <div id="profile-update-form" style="display: none;">
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
          <button type="submit" class="update-button">Update Profile</button>
        </form>
      </div>

      <!-- Buttons in a row -->
      <div class="flex gap-4 mt-4 justify-center">
        <button id="create-listing-button" class="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
          Create Listing
        </button>
        <button id="logout-button" class="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300">
          Logout
        </button>
      </div>
      
      <div id="user-listings" class="mt-8">
        <h2 class="text-2xl font-semibold text-center">User Listings</h2>
        <div id="listings-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6"></div>
      </div>
    </div>
  `;

  document
    .getElementById("edit-profile-button")
    .addEventListener("click", () => {
      const updateForm = document.getElementById("profile-update-form");
      updateForm.style.display =
        updateForm.style.display === "none" ? "block" : "none";
    });

  setupEventListeners();
}

function setupEventListeners() {
  document.getElementById("logout-button").addEventListener("click", onLogout);
  document
    .getElementById("update-profile-form")
    .addEventListener("submit", handleProfileUpdate);
  document
    .getElementById("create-listing-button")
    .addEventListener("click", () => {
      window.location.href = "/listings/create/";
    });
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
  container.innerHTML = "";

  if (!Array.isArray(listings) || listings.length === 0) {
    container.innerHTML = "<p class='text-center'>No listings found.</p>";
    return;
  }

  listings.forEach(({ id, title, description, media }) => {
    const listingElement = document.createElement("div");
    listingElement.classList.add(
      "bg-white",
      "border",
      "border-gray-200",
      "rounded-lg",
      "shadow-lg",
      "overflow-hidden",
      "transition-transform",
      "transform",
      "hover:scale-105",
      "cursor-pointer",
      "flex",
      "flex-col",
      "items-center",
    );

    const imageUrl = media?.[0]?.url || "public/images/listing-placeholder.jpg";

    listingElement.innerHTML = `
      <img src="${imageUrl}" alt="${title || "Listing"}" class="w-full h-48 object-cover">
      <div class="p-4 text-center">
        <h3 class="text-xl font-semibold text-gray-800">${title || "No title"}</h3>
        <p class="mt-2 text-gray-600 text-sm">${description || "No description available"}</p>
      </div>
    `;

    listingElement.addEventListener("click", () => {
      window.location.href = `/listings/?id=${id}`;
    });

    container.appendChild(listingElement);
  });
}

showProfile();
