import { readListing } from "../../api/listing/read.js";
import { deleteListing } from "../../api/listing/delete.js";
import { createBid } from "../../api/listing/bid.js"; // ✅ Import the bid function

async function fetchAndDisplayListing() {
  const listingId = new URLSearchParams(window.location.search).get("id");
  const listingContainer = document.getElementById("listingDetailContainer");

  if (!listingContainer || !listingId) return;

  try {
    // Fetch the listing with bids included
    const listing = await readListing(listingId, true, true); // Fetch with _bids flag to get bid data
    renderSingleListing(listing);
  } catch (err) {
    console.error(err);
    listingContainer.innerHTML = `<p class="text-red-500 text-center">Failed to load the listing.</p>`;
  }
}

function renderSingleListing(listing) {
  const listingContainer = document.getElementById("listingDetailContainer");

  if (!listingContainer) return;

  // ✅ Calculate the Highest Bid
  const highestBid = getHighestBid(listing.bids);

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
          
          <!-- Display Highest Bid -->
          <p><span class="font-semibold">Highest Bid:</span> ${highestBid}</p>
        </div>

        <!-- ⭐ Bidding Section ⭐ -->
        <div id="bidSection" class="mt-6 p-4 bg-teal-800 rounded-lg shadow-md">
          <h3 class="text-2xl font-semibold text-center mb-4">Place Your Bid</h3>
          <form id="bidForm" class="flex flex-col items-center gap-4">
            <input 
              type="number" 
              id="bidAmount" 
              class="w-full p-2 rounded-md text-black"
              placeholder="Enter bid amount"
              min="1"
              required 
            />
            <button 
              type="submit" 
              class="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition"
            >
              Place Bid
            </button>
          </form>
          <p id="bidMessage" class="text-center mt-2 text-sm"></p>
        </div>

        <!-- Buttons (Edit & Delete) -->
        <div class="mt-6 flex gap-4">
          <a href="edit/?id=${listing.id}" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Edit Listing
          </a>
          <button id="delete-listing-button" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
            Delete Listing
          </button>
        </div>
      </div>
    </div>
  `;

  // ✅ Handle Bidding Form Submission
  const bidForm = document.getElementById("bidForm");
  const bidMessage = document.getElementById("bidMessage");

  if (bidForm) {
    bidForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const bidAmount = document.getElementById("bidAmount").value;

      if (!bidAmount || bidAmount <= 0) {
        bidMessage.textContent = "Please enter a valid bid amount.";
        bidMessage.classList.add("text-red-500");
        return;
      }

      try {
        await createBid(listing.id, parseFloat(bidAmount));
        bidMessage.textContent = "Bid placed successfully!";
        bidMessage.classList.add("text-green-500");

        // ✅ Optional: Refresh the listing to update bid count
        fetchAndDisplayListing();
      } catch (error) {
        console.error("Error placing bid:", error);
        bidMessage.textContent = "Failed to place bid. Please try again.";
        bidMessage.classList.add("text-red-500");
      }
    });
  }

  // ✅ Handle Delete Button
  const deleteButton = document.getElementById("delete-listing-button");
  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      deleteListing(listing.id);
    });
  }
}

// ✅ Function to Get Highest Bid
function getHighestBid(bids) {
  if (!bids || bids.length === 0) {
    return "No bids yet";
  }

  // Find the highest bid from the bids array
  const highestBid = bids.reduce(
    (max, bid) => (bid.amount > max.amount ? bid : max),
    bids[0],
  );

  // Return the highest bid amount with currency formatting
  return `$${highestBid.amount.toFixed(2)}`;
}

fetchAndDisplayListing();
