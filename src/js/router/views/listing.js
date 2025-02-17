import { readListing } from "../../api/listing/read.js";

async function fetchAndDisplayListing() {
  const listingId = new URLSearchParams(window.location.search).get("id");
  const listingContainer = document.getElementById("listingDetailContainer");

  if (!listingContainer || !listingId) return;

  try {
    const listing = await readListing(listingId);
    renderSingleListing(listing);
  } catch (err) {
    console.error(err);
    listingContainer.innerHTML = `<p>Failed to load the listing.</p>`;
  }
}

function renderSingleListing(response) {
  const listing = response;
  const listingContainer = document.getElementById("listingDetailContainer");

  if (!listingContainer) return;

  listingContainer.innerHTML = `
    <div class="listing__image-container">
      ${listing.media?.[0]?.url ? `<img src="${listing.media[0].url}" alt="${listing.media[0].alt || "Listing image"}" class="listing__image" />` : `<div class="listing__no-image">No Image Available</div>`}
    </div>
    <div class="listing__content">
      <h2 class="listing__title">${listing.title || "Untitled"}</h2>
      <p class="listing__description">${listing.description || "No description available."}</p>
      <div class="listing__tags">
        ${listing.tags?.length ? listing.tags.map((tag) => `<span class="listing__tag">#${tag}</span>`).join("") : "<span>No tags available.</span>"}
      </div>
      <span class="listing__created">${new Date(listing.created).toLocaleString()}</span>
    </div>
  `;
}

fetchAndDisplayListing();
