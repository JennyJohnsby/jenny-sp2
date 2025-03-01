// Function to setup the search input and listen for search events
function setupSearch(listings) {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", async (event) => {
    const query = event.target.value.toLowerCase();

    if (query === "") {
      renderListings(listings);
      return;
    }

    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/auction/listings/search?q=${query}`,
      );
      const json = await response.json();
      const searchedListings = json.data;
      renderListings(searchedListings);
    } catch (error) {
      console.error("Error searching listings:", error);
    }
  });
}

// Function to fetch and display listings with optional filters
export async function fetchAndDisplayListings(
  filterByBFF = true,
  tagFilter = "",
) {
  const urlBase = "https://v2.api.noroff.dev/auction/listings";
  const listingContainer = document.getElementById("listingContainer");

  if (!listingContainer) {
    console.error("Listing container not found in the DOM");
    return;
  }

  listingContainer.innerHTML = "<p>Loading listings...</p>";

  try {
    let url = urlBase;

    // Apply _active filter if selected
    if (filterByBFF) {
      url = `${urlBase}?_active=true`; // Filter for active listings
    }

    // Apply _tag filter if provided
    if (tagFilter) {
      url += `&_tag=${tagFilter}`; // Filter by specific tag
    }

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
    setupSearch(listings); // Setup search functionality on the fetched listings
  } catch (error) {
    console.error("Error fetching listings:", error);
    listingContainer.innerHTML =
      "<p>Failed to load listings. Please try again later.</p>";
  }
}

// Function to render listings to the DOM with Tailwind styling
function renderListings(listings) {
  const listingContainer = document.getElementById("listingContainer");
  listingContainer.innerHTML = "";

  listings.forEach((listing) => {
    const listingElement = document.createElement("div");
    listingElement.classList.add(
      "listing",
      "bg-white",
      "rounded-lg",
      "shadow-lg",
      "overflow-hidden",
      "cursor-pointer",
      "transition",
      "hover:shadow-xl",
      "transition-all",
      "duration-300",
    );

    const userVisibleTags =
      listing.tags?.filter((tag) => tag !== "BidForForest") || [];
    const highestBid =
      listing._count?.bids > 0 ? "Bids available" : "No bids yet";

    listingElement.innerHTML = `
      <div class="listing__image-container overflow-hidden relative group">
        ${
          listing.media?.[0]?.url
            ? `<img src="${listing.media[0].url}" alt="${listing.media[0].alt || "Listing image"}" class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />`
            : `<img src="/images/avatar-placeholder.png" alt="Placeholder image" class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />`
        }
      </div>
      <div class="listing__content p-6 flex flex-col justify-between h-full">
        <h3 class="listing__title text-xl font-semibold text-gray-800 hover:text-teal-600 transition-all duration-300">${listing.title || "No Title"}</h3>
        <p class="listing__description text-gray-600 text-sm">${listing.description || "No description available."}</p>
        <div class="listing__tags flex flex-wrap gap-2">
          ${userVisibleTags
            .map(
              (tag) =>
                `<span class="listing__tag inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">${tag}</span>`,
            )
            .join("")}
        </div>
        <p class="listing__highest-bid text-sm font-semibold text-gray-700">${highestBid}</p>
      </div>
    `;

    listingElement.addEventListener("click", () => {
      window.location.href = `/listings/?id=${listing.id}`;
    });

    listingContainer.appendChild(listingElement);
  });
}

// Function to set up the filter toggle functionality
function setupFilterToggle() {
  const filterToggle = document.getElementById("filterToggle");

  if (filterToggle) {
    filterToggle.addEventListener("change", (event) => {
      const isChecked = event.target.checked;
      const selectedTag = document.getElementById("tagSelect")?.value || ""; // Get selected tag
      fetchAndDisplayListings(isChecked, selectedTag);
    });
  }
}

// Function to set up the tag filter dropdown
function setupTagFilter() {
  const tagSelect = document.getElementById("tagSelect");

  if (tagSelect) {
    tagSelect.addEventListener("change", (event) => {
      const selectedTag = event.target.value;
      const isChecked = document.getElementById("filterToggle").checked; // Get the active filter status
      fetchAndDisplayListings(isChecked, selectedTag);
    });
  }
}

// Call the fetch function to load listings initially with the default filter
fetchAndDisplayListings(true);

// Setup the filter toggle and tag filter
setupFilterToggle();
setupTagFilter();
