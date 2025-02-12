import { createListing } from "../../api/listing/create.js";
import { displayBanner } from "../../utilities/banners.js";

export async function onCreateListing(event) {
  event.preventDefault();

  const form = event.target;

  const title = form.title.value.trim();
  const description = form.description.vaule.trim();
  const tags = form.tags.value.trim().split(",").map((tag) => tag.trim()).filter.(Boolean);
  const mediaUrl = form.mediaUrl.value.trim();
  const mediaAlt = form.mediaAlt.value.trim();

  if(!title){
    displayBanner("title is required", "error");
    return;
  }

  const listingData = {
    title,
    description: description  || "",
    tags: tags,
    media: mediaUrl ? { url: mediaUrl, alt: mediaAlt }: null,
  };

  try{
    const response = await createListing(listingData);
    displayBanner("listing created succsessfully: ${response.data.title}", "succsess");

    setTimeout(() => {
      window.location.href = "/profile/";
    }, 3000);
  } catch (error){
    displayBanner("failed to create listing" + error.messsage, "error");
  }

  form.reset();
}

document.addEventListener("DOMContentLoaded", () => {
  const createListingForm = document.getElementById("createListing");

  if(createListingForm) {
    createListingForm.addEventListener("submit", onCreateListing);
} else {
console.error("create listing form could not be found in the DOM");
});