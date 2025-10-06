import { readListing } from "../../api/listing/read.js";
import { deleteListing } from "../../api/listing/delete.js";
import { createBid } from "../../api/listing/bid.js";

async function fetchAndDisplayListing() {
  const listingId = new URLSearchParams(window.location.search).get("id");
  const listingContainer = document.getElementById("listingDetailContainer");

  if (!listingContainer || !listingId) return;

  try {
    const listing = await readListing(listingId, true, true, true);
    renderSingleListing(listing);
  } catch (err) {
    console.error(err);
    listingContainer.innerHTML = `<p class="text-red-500 text-center">Failed to load the listing.</p>`;
  }
}

function renderSingleListing(listing) {
  const listingContainer = document.getElementById("listingDetailContainer");
  if (!listingContainer) return;

  const highestBid = getHighestBid(listing.bids);
  const sellerName = listing.seller?.name || "Unknown Seller";

  listingContainer.innerHTML = `
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-20">
      <!-- Image -->
      <div class="relative">
        ${
          listing.media?.[0]?.url
            ? `<img src="${listing.media[0].url}" alt="${
                listing.media[0].alt || "Listing image"
              }" class="w-full h-96 object-cover" />`
            : `<div class="w-full h-96 bg-gray-100 flex items-center justify-center text-gray-500 text-lg">No Image Available</div>`
        }
      </div>

      <!-- Content -->
      <div class="p-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-3">${
          listing.title || "Untitled"
        }</h2>
        <p class="text-gray-600 text-lg mb-6">${
          listing.description || "No description available."
        }</p>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mb-6">
          ${
            listing.tags?.length
              ? listing.tags
                  .map(
                    (tag) =>
                      `<span class="bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-medium px-3 py-1 rounded-full transition">#${tag}</span>`,
                  )
                  .join(" ")
              : `<span class="text-gray-500 italic">No tags available.</span>`
          }
        </div>

        <!-- Info -->
        <div class="grid sm:grid-cols-2 gap-4 text-gray-700 mb-8">
          <p><span class="font-semibold">Created on:</span> ${new Date(
            listing.created,
          ).toLocaleString()}</p>
          <p><span class="font-semibold">Ends at:</span> ${new Date(
            listing.endsAt,
          ).toLocaleString()}</p>
          <p><span class="font-semibold">Number of bids:</span> ${
            listing._count?.bids || 0
          }</p>
          <p><span class="font-semibold">Highest Bid:</span> ${highestBid}</p>
          <p><span class="font-semibold">Seller:</span> ${sellerName}</p>
        </div>

        <!-- Bid Section -->
        <div id="bidSection" class="mt-8 p-6 bg-teal-700 text-white rounded-lg shadow-md">
          <h3 class="text-2xl font-semibold text-center mb-4">Place Your Bid</h3>
          <form id="bidForm" class="flex flex-col sm:flex-row items-center gap-4">
            <input 
              type="number" 
              id="bidAmount" 
              class="flex-1 w-full p-3 rounded-md text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400" 
              placeholder="Enter bid amount" 
              min="1" 
              required 
            />
            <button 
              type="submit" 
              class="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-md font-semibold transition">
              Place Bid
            </button>
          </form>
          <p id="bidMessage" class="text-center mt-3 text-sm"></p>
        </div>

        <!-- Actions -->
        <div class="mt-8 flex flex-wrap gap-4">
          <a 
            href="edit/?id=${listing.id}" 
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-semibold transition shadow-sm">
            Edit Listing
          </a>
          <button 
            id="delete-listing-button" 
            class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md font-semibold transition shadow-sm">
            Delete Listing
          </button>
        </div>
      </div>
    </div>
  `;

  // Bid form handler
  const bidForm = document.getElementById("bidForm");
  const bidMessage = document.getElementById("bidMessage");

  if (bidForm) {
    bidForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const bidAmount = document.getElementById("bidAmount").value;

      if (!bidAmount || bidAmount <= 0) {
        bidMessage.textContent = "Please enter a valid bid amount.";
        bidMessage.className = "text-center mt-2 text-sm text-red-500";
        return;
      }

      try {
        await createBid(listing.id, parseFloat(bidAmount));
        bidMessage.textContent = "Bid placed successfully!";
        bidMessage.className = "text-center mt-2 text-sm text-green-500";
        fetchAndDisplayListing();
      } catch (error) {
        console.error("Error placing bid:", error);
        bidMessage.textContent = "Failed to place bid. Please try again.";
        bidMessage.className = "text-center mt-2 text-sm text-red-500";
      }
    });
  }

  // Delete button with confirmation
  const deleteButton = document.getElementById("delete-listing-button");
  if (deleteButton) {
    deleteButton.addEventListener("click", async () => {
      const confirmDelete = confirm(
        "Are you sure you want to delete this listing? This action cannot be undone.",
      );
      if (confirmDelete) {
        try {
          await deleteListing(listing.id);
          alert("Listing deleted successfully.");
          window.location.href = "/"; // Redirect to homepage after deletion
        } catch (err) {
          console.error("Error deleting listing:", err);
          alert("Failed to delete the listing.");
        }
      }
    });
  }
}

function getHighestBid(bids) {
  if (!bids || bids.length === 0) {
    return "No bids yet";
  }
  const highestBid = bids.reduce(
    (max, bid) => (bid.amount > max.amount ? bid : max),
    bids[0],
  );
  return `$${highestBid.amount.toFixed(2)}`;
}

fetchAndDisplayListing();
