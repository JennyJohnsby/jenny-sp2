import { readListing } from "../../api/listing/read"; // Import the function to get the listing
import { updateListing } from "../../api/listing/update"; // Import the function to update the listing
import { displayBanner } from "../../utilities/banners.js"; // Import banner utility
import { authGuard } from "../../utilities/authGuard.js";

authGuard(); // Ensure the user is authenticated

// Fetch the listing ID from URL parameters
const url = new URL(window.location.href);
const id = url.searchParams.get("id");

// If no ID, display error and redirect to profile
if (!id) {
  displayBanner("No listing ID found. Redirecting...", "error");
  setTimeout(() => (window.location.href = "/"), 2000);
  throw new Error("No listing ID found.");
}

// Get the form
const form = document.forms.editListing;
if (!form) {
  console.error("Edit listing form not found.");
  displayBanner("Error: Form not found.", "error");
  throw new Error("Form not found.");
}

// Map form inputs
const idInput = form.elements["id"];
const titleInput = form.elements["title"];
const descriptionInput = form.elements["description"];
const tagsInput = form.elements["tags"];
const mediaUrlInput = form.elements["mediaUrl"];
const mediaAltInput = form.elements["mediaAlt"];

// Function to prefill form with the listing data
async function prefillEditForm() {
  try {
    const listing = await readListing(id);

    if (!listing) {
      throw new Error("Listing data not found.");
    }

    // Prefill form fields
    idInput.value = listing.id || "";
    titleInput.value = listing.title || "";
    descriptionInput.value = listing.description || "";
    tagsInput.value = listing.tags ? listing.tags.join(", ") : "";

    // Handle media URLs
    if (listing.media?.length > 0) {
      mediaUrlInput.value = listing.media[0].url || "";
      mediaAltInput.value = listing.media[0].alt || "";
    } else {
      mediaUrlInput.value = "";
      mediaAltInput.value = "";
    }
  } catch (error) {
    console.error("Error loading listing:", error);
    displayBanner("Failed to load listing details.", "error");
  }
}

// Event listener for form submission
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Retrieve token before submitting
  const accessToken = localStorage.getItem("accessToken"); // Corrected key name
  if (!accessToken) {
    displayBanner("You must be logged in to update a listing.", "error");
    setTimeout(() => (window.location.href = "/"), 2000);
    return;
  }

  // Prepare the updated listing data
  const updatedListing = {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    tags: tagsInput.value.split(",").map((tag) => tag.trim()),
    media: mediaUrlInput.value
      ? [{ url: mediaUrlInput.value.trim(), alt: mediaAltInput.value.trim() }]
      : [],
  };

  try {
    await updateListing(id, updatedListing);
    displayBanner("Listing updated successfully!", "success");

    // Redirect after update
    setTimeout(() => (window.location.href = "/"), 2000);
  } catch (error) {
    console.error("Error updating listing:", error);
    displayBanner(
      "Failed to update listing. Please check your input.",
      "error",
    );
  }
});

// Call prefill function on page load
prefillEditForm();
