import { createListing } from "../../api/listing/create.js";
import { displayBanner } from "../../utilities/banners.js";

export async function onCreateListing(event) {
  event.preventDefault();

  const form = event.target;

  const title = form.title.value.trim();
  const description = form.description.value.trim();
  const tags = form.tags.value
    .trim()
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const mediaUrl = form.mediaUrl.value.trim();
  const mediaAlt = form.mediaAlt.value.trim();
  const endsAt = form.endsAt.value.trim();

  if (!title) {
    displayBanner("Title is required", "error");
    return;
  }
  console.log(mediaUrl);
  if (!endsAt) {
    displayBanner("End date is required", "error");
    return;
  }

  const listingData = {
    title,
    description: description || "",
    tags,
    media: mediaUrl ? [{ url: mediaUrl, alt: mediaAlt }] : null,
    endsAt,
  };

  try {
    const response = await createListing(listingData);
    displayBanner(
      `Listing created successfully: ${response.data.title}`,
      "success",
    );

    setTimeout(() => {
      window.location.href = "/profile/";
    }, 3000);
  } catch (error) {
    displayBanner(`Failed to create listing: ${error.message}`, "error");
  }

  form.reset();
}

document.addEventListener("DOMContentLoaded", () => {
  const createListingForm = document.getElementById("createListing");

  if (createListingForm) {
    createListingForm.addEventListener("submit", onCreateListing);
  } else {
    console.error("Create listing form could not be found in the DOM");
  }
});
