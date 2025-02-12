// Function to fetch and display a single listing
async function fetchAndDisplayListing() {
  // Get the listing ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const listingId = urlParams.get("id");

  // Check if there's an ID in the URL
  if (!listingId) {
    console.error("No listing ID found in URL");
    document.getElementById("listingDetailContainer").innerHTML =
      "<p>Listing not found.</p>";
    return;
  }

  // Define the API endpoint
  const url = `https://v2.api.noroff.dev/auction/listings/${listingId}`;

  try {
    // Fetch the listing data
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch listing details.");
    }

    const data = await response.json();
    const listing = data.data;

    // Render the listing details
    renderListingDetails(listing);
  } catch (error) {
    console.error("Error fetching listing:", error);
    document.getElementById("listingDetailContainer").innerHTML =
      "<p>Failed to load listing. Please try again later.</p>";
  }
}

// Function to render the listing details
function renderListingDetails(listing) {
  const container = document.getElementById("listingDetailContainer");

  // Clear previous content
  container.innerHTML = "";

  // Create HTML content for the listing
  container.innerHTML = `
    <div class="listing-detail bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      <div class="listing-detail__image-container">
        ${
          listing.media?.[0]?.url
            ? `<img src="${listing.media[0].url}" alt="${listing.media[0].alt || "Listing image"}" class="w-full h-64 object-cover rounded-md" />`
            : `<img src="/images/avatar-placeholder.png" alt="Placeholder image" class="w-full h-64 object-cover rounded-md" />`
        }
      </div>
      <h2 class="text-2xl font-bold mt-4">${listing.title || "No Title"}</h2>
      <p class="text-gray-600 mt-2">${listing.description || "No description available."}</p>
      <p class="text-sm text-gray-500 mt-2">Created on: ${new Date(listing.created).toLocaleDateString()}</p>
      <p class="text-sm text-gray-500">Ends at: ${new Date(listing.endsAt).toLocaleDateString()}</p>
      <p class="mt-4 font-semibold text-gray-700">Bids: ${listing._count?.bids > 0 ? listing._count.bids : "No bids yet"}</p>
    </div>
  `;
}

// Call the function when the page loads
fetchAndDisplayListing();
