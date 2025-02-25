import { readListing } from "../../api/listing/read";
import { onUpdateListing } from "../../ui/listing/update";
import { authGuard } from "../../utilities/authGuard";
import { displayBanner } from "../../utilities/banners.js";

authGuard();

const url = new URL(window.location.href);
const id = url.searchParams.get("id");

if (!id) {
  displayBanner("No listing ID found. Please try again.", "error");
  setTimeout(() => {
    window.location.href = "/profile";
  }, 2000);
  throw new Error("No listing ID found.");
}

const form = document.forms.editListing;

const idInput = form.elements["id"];
const title = form.elements["title"];
const description = form.elements["description"];
const tags = form.elements["tags"];
const mediaUrl = form.elements["mediaUrl"];
const mediaAlt = form.elements["mediaAlt"];

const listingData = (await readListing(id)).data;

idInput.value = listingDataData.id;
title.value = listingDataData.title;
description.value = listingDataData.description;
tags.value = listingDataData.tags.join(", ");

if (listingDataData.media) {
  mediaUrl.value = listingDataData.media.url || "";
  mediaAlt.value = listingDataData.media.alt || "";
} else {
  mediaUrl.value = "";
  mediaAlt.value = "";
}

if (form) {
  form.addEventListener("submit", onUpdateListing);
}
