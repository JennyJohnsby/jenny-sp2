// Function to handle search
function setupSearch(listings) {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return; // Ensure input exists

  searchInput.addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    const filteredListings = listings.filter((listing) =>
      listing.title.toLowerCase().includes(query),
    );
    renderListings(filteredListings); // Update displayed listings
  });
}

// Function to fetch all listings
export async function fetchAndDisplayListings() {
  const url = "https://v2.api.noroff.dev/auction/listings"; // API endpoint
  const listingContainer = document.getElementById("listingContainer"); // Listings container

  if (!listingContainer) {
    console.error("Listing container not found in the DOM");
    return;
  }

  listingContainer.innerHTML = "<p>Loading listings...</p>"; // Show loading message

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch listings.");
    }

    const data = await response.json();
    const listings = data.data;

    if (listings.length === 0) {
      listingContainer.innerHTML = "<p>No listings available.</p>";
      return;
    }

    renderListings(listings);
    setupSearch(listings); // ✅ Enable search functionality
  } catch (error) {
    console.error("Error fetching listings:", error);
    listingContainer.innerHTML =
      "<p>Failed to load listings. Please try again later.</p>";
  }
}

// Function to render listings
function renderListings(listings) {
  const listingContainer = document.getElementById("listingContainer");
  listingContainer.innerHTML = ""; // Clear previous listings

  listings.forEach((listing) => {
    const listingElement = document.createElement("div");
    listingElement.classList.add(
      "listing",
      "bg-white",
      "rounded-lg",
      "shadow-md",
      "overflow-hidden",
      "mb-6",
      "cursor-pointer",
      "transition",
      "hover:shadow-lg",
    );

    // Handle missing tags
    const userVisibleTags =
      listing.tags?.filter((tag) => tag !== "BidForForest") || [];
    const highestBid =
      listing._count?.bids > 0 ? "Bids available" : "No bids yet";

    // Listing HTML
    listingElement.innerHTML = `
      <div class="listing__image-container">
        ${
          listing.media?.[0]?.url
            ? `<img src="${listing.media[0].url}" alt="${listing.media[0].alt || "Listing image"}" class="w-full h-48 object-cover" />`
            : `<img src="/images/avatar-placeholder.png" alt="Placeholder image" class="w-full h-48 object-cover" />`
        }
      </div>
      <div class="listing__content p-4">
        <h3 class="listing__title text-xl font-semibold text-gray-800">${listing.title || "No Title"}</h3>
        <p class="listing__description text-gray-600 mt-2">${listing.description || "No description available."}</p>
        <div class="listing__tags mt-3">
          ${userVisibleTags.map((tag) => `<span class="listing__tag inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-2">${tag}</span>`).join("")}
        </div>
        <p class="listing__highest-bid mt-2 text-sm font-semibold text-gray-700">${highestBid}</p>
      </div>
    `;

    // ✅ Navigate to listing details when clicked
    listingElement.addEventListener("click", () => {
      window.location.href = `/listings/index.html?id=${listing.id}`;
    });

    listingContainer.appendChild(listingElement);
  });
}

// Call function on page load
fetchAndDisplayListings();
