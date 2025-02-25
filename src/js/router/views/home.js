// Function to set up the search functionality
function setupSearch(listings) {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  // Add event listener to the search input
  searchInput.addEventListener("input", async (event) => {
    const query = event.target.value.toLowerCase();

    // Only fetch data if the query is not empty
    if (query === "") {
      // If query is empty, just render all listings
      renderListings(listings);
      return;
    }

    try {
      // Fetch filtered listings from the API based on the search query
      const response = await fetch(
        `https://v2.api.noroff.dev/auction/listings/search?q=${query}`,
      );
      const json = await response.json();
      const searchedListings = json.data;
      renderListings(searchedListings); // Render the search results
    } catch (error) {
      console.error("Error searching listings:", error);
    }
  });
}

// Function to fetch and display listings with optional tag filtering
export async function fetchAndDisplayListings(filterByBFF = true) {
  const urlBase = "https://v2.api.noroff.dev/auction/listings"; // API endpoint base
  const listingContainer = document.getElementById("listingContainer"); // Listings container

  if (!listingContainer) {
    console.error("Listing container not found in the DOM");
    return;
  }

  listingContainer.innerHTML = "<p>Loading listings...</p>"; // Show loading message

  try {
    // Set up URL with default filter by tag "BFF" if filterByBFF is true
    let url = urlBase;
    if (filterByBFF) {
      url = `${urlBase}?_tag=BFF&_active=true`; // Filter for BFF tag and active listings
    }

    // Fetch the listings from the API
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

    // Render the listings
    renderListings(listings);

    // Set up search functionality
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

    // Handle missing or empty tags
    const userVisibleTags =
      listing.tags?.filter((tag) => tag !== "BidForForest") || [];
    const highestBid =
      listing._count?.bids > 0 ? "Bids available" : "No bids yet";

    // Create the HTML structure for each listing
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

    // Add event listener to navigate to the listing details when clicked
    listingElement.addEventListener("click", () => {
      window.location.href = `/listings/?id=${listing.id}`;
    });

    // Append the listing element to the container
    listingContainer.appendChild(listingElement);
  });
}

// Function to handle the toggle for filtering by BFF tag
function setupFilterToggle() {
  const filterToggle = document.getElementById("filterToggle");

  if (filterToggle) {
    // Add event listener for the filter toggle (checkbox)
    filterToggle.addEventListener("change", (event) => {
      const isChecked = event.target.checked;
      // Re-fetch and display listings based on whether the checkbox is checked
      fetchAndDisplayListings(isChecked); // If checked, filter by BFF; if unchecked, show all
    });
  }
}

// Initial call to fetch listings with default filter (BFF tag)
fetchAndDisplayListings(true); // Pass 'true' to filter by the BFF tag by default

// Set up filter toggle on page load
setupFilterToggle();
