import { updateListing } from "../../api/listing/update.js";
import { displayBanner } from "../../utilities/banners.js";

export async function onUpdateListing(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const listingId = formData.get("id");
  const title = formData.get("title")?.trim();
  const description = formData.get("description")?.trim();
  const tags = formData
    .get("tags")
    ?.split(",")
    .map((tag) => tag.trim());
  const mediaUrl = formData.get("mediaUrl")?.trim();
  const mediaAlt = formData.get("mediaAlt")?.trim();

  const media = mediaUrl ? [{ url: mediaUrl, alt: mediaAlt || "" }] : [];

  try {
    const updatedListing = await updateListing(listingId, {
      title,
      description,
      tags,
      media,
    });
    console.log("Listing updated successfully:", updatedListing);

    // Show success banner
    displayBanner("Listing updated successfully!", "success");

    // Redirect back to profile after 2 seconds
    setTimeout(() => {
      window.location.href = "/profile/";
    }, 2000);
  } catch (error) {
    console.error("Error updating listing:", error);

    // Handle API errors
    if (error.message.includes("400")) {
      displayBanner("Invalid data provided. Please check your input.", "error");
    } else if (error.message.includes("401")) {
      displayBanner("Unauthorized. Please log in again.", "error");
    } else if (error.message.includes("404")) {
      displayBanner("Listing not found. It may have been deleted.", "error");
    } else if (error.message.includes("500")) {
      displayBanner("Server error. Please try again later.", "error");
    } else {
      displayBanner(error.message || "An unexpected error occurred.", "error");
    }
  }
}
