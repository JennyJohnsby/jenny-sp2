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
    <div id="profile-view" class="max-w-7xl mx-auto p-6 shadow-md rounded-lg">
      <div class="profile-banner">
        <div class="relative">
          <img src="${profile.banner?.url || "public/images/banner-placeholder.jpg"}" alt="${profile.banner?.alt || "User banner"}" class="profile-banner-image w-full h-60 object-cover rounded-t-lg"/>
          <div class="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-4 py-2 rounded-md">
            <h1 class="text-2xl font-semibold">${profile.name || "User Name"}</h1>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center space-y-4 mt-8">
        <img src="${profile.avatar?.url || "public/images/avatar-placeholder.png"}" alt="${profile.avatar?.alt || "User avatar"}" class="profile-avatar w-32 h-32 object-cover rounded-full border-4 shadow-lg"/>
        <div class="text-center space-y-2">
          <p id="profile-email" class="text-lg font-medium">${profile.email || "Not provided"}</p>
          <p id="profile-bio" class="text-sm">${profile.bio || "No bio available"}</p>
          <div class="flex justify-center gap-8 text-sm">
            <p><strong>Total Credit:</strong> <span id="profile-credits">${profile.credits || 0}</span></p>
            <p><strong>Total Listings:</strong> ${profile._count?.listings || 0}</p>
            <p><strong>Auctions Won:</strong> ${profile._count?.wins || 0}</p>
          </div>
          <p class="text-sm">${profile.venueManager ? "Venue Manager" : "Regular User"}</p>
        </div>
        <div id="profile-update-form" class="hidden mt-8 space-y-4">
          <h2 class="text-2xl font-semibold text-gray-800">Update Profile</h2>
          <form id="update-profile-form" class="space-y-4">
            <div>
              <label for="bio" class="block text-sm font-medium text-gray-700">Bio:</label>
              <textarea id="bio" name="bio" class="w-full p-3 border border-gray-300 rounded-lg" rows="4">${profile.bio || ""}</textarea>
            </div>
            <div>
              <label for="avatar-url" class="block text-sm font-medium text-gray-700">Avatar URL:</label>
              <input type="url" id="avatar-url" name="avatar-url" class="w-full p-3 border border-gray-300 rounded-lg" value="${profile.avatar?.url || ""}" />
            </div>
            <div>
              <label for="banner-url" class="block text-sm font-medium text-gray-700">Banner URL:</label>
              <input type="url" id="banner-url" name="banner-url" class="w-full p-3 border border-gray-300 rounded-lg" value="${profile.banner?.url || ""}" />
            </div>
            <button type="submit" class="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
              Update Profile
            </button>
          </form>
        </div>
        <div class="flex gap-4 mt-8 justify-center">
          <button id="create-listing-button" class="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
            Create Listing
          </button>
          <button id="logout-button" class="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300">
            Logout
          </button>
          <button id="edit-profile-button" class="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300">
            Edit Profile
          </button>
        </div>
        <div id="user-listings" class="mt-12">
          <h2 class="text-2xl font-semibold text-center">User Listings</h2>
          <div id="listings-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6"></div>
        </div>
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

  const profileData = {
    bio: document.getElementById("bio").value,
    avatar: {
      url: document.getElementById("avatar-url").value || "",
      alt: "User Avatar",
    },
    banner: {
      url: document.getElementById("banner-url").value || "",
      alt: "User Banner",
    },
  };

  try {
    const updatedProfile = await updateProfile(profileData);
    if (!updatedProfile) throw new Error("Failed to update profile.");

    const profile = await readProfile();
    if (!profile) throw new Error("Error fetching updated profile.");

    renderProfile(profile);

    displayBanner("Profile updated successfully!", "success");

    toggleUpdateForm();

    const listings = await fetchUserListings();
    displayListings(listings);
  } catch (error) {
    console.error("Error updating profile:", error);
    displayBanner("Error updating profile. Please try again.", "error");
  }
}

function toggleUpdateForm() {
  const updateForm = document.getElementById("profile-update-form");
  updateForm.style.display =
    updateForm.style.display === "none" ? "block" : "none";
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
      <img src="${imageUrl}" alt="${title || "Listing"}" class="w-full h-48 object-cover rounded-t-lg">
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
