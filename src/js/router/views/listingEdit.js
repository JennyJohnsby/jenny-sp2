import { readListing } from "../../api/listing/read";
import { updateListing } from "../../api/listing/update";
import { displayBanner } from "../../utilities/banners.js";
import { authGuard } from "../../utilities/authGuard.js";

authGuard();

const url = new URL(window.location.href);
const id = url.searchParams.get("id");

if (!id) {
  displayBanner("No listing ID found. Redirecting...", "error");
  setTimeout(() => (window.location.href = "/"), 2000);
  throw new Error("No listing ID found.");
}

const form = document.forms.editListing;
if (!form) {
  console.error("Edit listing form not found.");
  displayBanner("Error: Form not found.", "error");
  throw new Error("Form not found.");
}

const idInput = form.elements["id"];
const titleInput = form.elements["title"];
const descriptionInput = form.elements["description"];
const tagsInput = form.elements["tags"];
const mediaUrlInput = form.elements["mediaUrl"];
const mediaAltInput = form.elements["mediaAlt"];

async function prefillEditForm() {
  try {
    const listing = await readListing(id);

    if (!listing) {
      throw new Error("Listing data not found.");
    }

    idInput.value = listing.id || "";
    titleInput.value = listing.title || "";
    descriptionInput.value = listing.description || "";
    tagsInput.value = listing.tags ? listing.tags.join(", ") : "";

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

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    displayBanner("You must be logged in to update a listing.", "error");
    setTimeout(() => (window.location.href = "/"), 2000);
    return;
  }

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

    setTimeout(() => (window.location.href = "/profile/"), 2000);
  } catch (error) {
    console.error("Error updating listing:", error);
    displayBanner(
      "Failed to update listing. Please check your input.",
      "error",
    );
  }
});

prefillEditForm();
