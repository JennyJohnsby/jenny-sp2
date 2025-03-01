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

    displayBanner("Listing updated successfully!", "success");
  } catch (error) {
    console.error("Error updating listing:", error);

    if (error.message.includes("400")) {
      displayBanner(
        "The information provided is incomplete or invalid. Please check and try again.",
        "error",
      );
    } else if (error.message.includes("401")) {
      displayBanner(
        "You must be logged in to make changes to this listing.",
        "error",
      );
    } else if (error.message.includes("404")) {
      displayBanner(
        "This listing does not exist or has been removed.",
        "error",
      );
    } else if (error.message.includes("500")) {
      displayBanner(
        "There was an issue with the server. Please try again later.",
        "error",
      );
    } else {
      displayBanner("An unexpected error occurred. Please try again.", "error");
    }
  }
}
