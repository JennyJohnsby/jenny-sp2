import { readListing } from "../../api/listing/read.js";
import { deleteListing } from "../../api/listing/delete.js";

async function fetchAndDisplayListing() {
  const listingId = new URLSearchParams(window.location.search).get("id");
  const listingContainer = document.getElementById("listingDetailContainer");

  if (!listingContainer || !listingId) return;

  try {
    const listing = await readListing(listingId);
    renderSingleListing(listing);
  } catch (err) {
    console.error(err);
    listingContainer.innerHTML = `<p class="text-red-500 text-center">Failed to load the listing.</p>`;
  }
}

function renderSingleListing(listing) {
  const listingContainer = document.getElementById("listingDetailContainer");

  if (!listingContainer) return;

  listingContainer.innerHTML = `
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden mt-20 p-6">
      <!-- Image Section -->
      <div class="relative">
        ${
          listing.media?.[0]?.url
            ? `<img src="${listing.media[0].url}" alt="${listing.media[0].alt || "Listing image"}" class="w-full h-96 object-cover rounded-lg" />`
            : `<div class="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">No Image Available</div>`
        }
      </div>

      <!-- Content Section -->
      <div class="mt-6">
        <h2 class="text-3xl font-bold text-gray-800 mb-2">${listing.title || "Untitled"}</h2>
        <p class="text-gray-600 text-lg mb-4">${listing.description || "No description available."}</p>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mb-4">
          ${
            listing.tags?.length
              ? listing.tags
                  .map(
                    (tag) =>
                      `<span class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-md">#${tag}</span>`,
                  )
                  .join(" ")
              : `<span class="text-gray-500">No tags available.</span>`
          }
        </div>

        <!-- Additional Information -->
        <div class="mt-4 text-gray-700">
          <p><span class="font-semibold">Created on:</span> ${new Date(listing.created).toLocaleString()}</p>
          <p><span class="font-semibold">Ends at:</span> ${new Date(listing.endsAt).toLocaleString()}</p>
          <p><span class="font-semibold">Number of bids:</span> ${listing._count?.bids || 0}</p>
        </div>

          <!-- Buttons (Edit & Delete) -->
        <div class="mt-6 flex gap-4">
          <!-- Update Listing Button -->
          <a href="edit/?id=${listing.id}" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Edit Listing
          </a>

          <!-- Delete Listing Button -->
          <button id="delete-listing-button" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
            Delete Listing
          </button>
        </div>
      </div>
    </div>
  `;

  // Add event listener for the delete button
  const deleteButton = document.getElementById("delete-listing-button");
  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      deleteListing(listing.id); // Call delete function with listing ID
    });
  }
}

fetchAndDisplayListing();
