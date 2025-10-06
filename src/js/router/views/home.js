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

  // Loading state
  listingContainer.innerHTML = `
    <div class="text-center py-12 text-gray-500 animate-pulse">
      Loading listings...
    </div>
  `;

  try {
    let url = urlBase;

    if (filterByBFF) {
      url = `${urlBase}?_active=true`;
    }

    if (tagFilter) {
      url += `&_tag=${tagFilter}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch listings.");
    }

    const data = await response.json();
    const listings = data.data;

    if (listings.length === 0) {
      listingContainer.innerHTML = `
        <div class="text-center py-12 text-gray-500 italic">
          No listings available.
        </div>
      `;
      return;
    }

    renderListings(listings);
    setupSearch(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    listingContainer.innerHTML = `
      <div class="text-center py-12 text-red-500">
        Failed to load listings. Please try again later.
      </div>
    `;
  }
}

function renderListings(listings) {
  const listingContainer = document.getElementById("listingContainer");
  listingContainer.innerHTML = "";

  listings.forEach((listing) => {
    const listingElement = document.createElement("div");
    listingElement.classList.add(
      "listing",
      "bg-white",
      "rounded-xl",
      "shadow-md",
      "overflow-hidden",
      "cursor-pointer",
      "transform",
      "transition",
      "hover:scale-[1.02]",
      "hover:shadow-lg",
      "duration-300",
      "flex",
      "flex-col",
    );

    const userVisibleTags =
      listing.tags?.filter((tag) => tag !== "BidForForest") || [];
    const highestBid =
      listing._count?.bids > 0 ? "Bids available" : "No bids yet";

    listingElement.innerHTML = `
      <!-- Image -->
      <div class="listing__image-container overflow-hidden relative group">
        ${
          listing.media?.[0]?.url
            ? `<img src="${listing.media[0].url}" alt="${
                listing.media[0].alt || "Listing image"
              }" class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />`
            : `<img src="/images/avatar-placeholder.png" alt="Placeholder image" class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />`
        }
      </div>

      <!-- Content -->
      <div class="listing__content p-5 flex flex-col justify-between flex-1">
        <h3 class="listing__title text-lg font-semibold text-gray-800 mb-2 line-clamp-1 hover:text-teal-600 transition-colors">
          ${listing.title || "No Title"}
        </h3>
        <p class="listing__description text-gray-600 text-sm mb-3 line-clamp-2">
          ${listing.description || "No description available."}
        </p>

        <!-- Tags -->
        <div class="listing__tags flex flex-wrap gap-2 mb-3">
          ${
            userVisibleTags.length
              ? userVisibleTags
                  .map(
                    (tag) =>
                      `<span class="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full hover:bg-blue-200 transition">${tag}</span>`,
                  )
                  .join("")
              : `<span class="text-gray-400 italic text-xs">No tags</span>`
          }
        </div>

        <p class="listing__highest-bid text-sm font-semibold text-gray-700 mt-auto">
          ${highestBid}
        </p>
      </div>
    `;

    listingElement.addEventListener("click", () => {
      window.location.href = `/listings/?id=${listing.id}`;
    });

    listingContainer.appendChild(listingElement);
  });
}

function setupFilterToggle() {
  const filterToggle = document.getElementById("filterToggle");

  if (filterToggle) {
    filterToggle.addEventListener("change", (event) => {
      const isChecked = event.target.checked;
      const selectedTag = document.getElementById("tagSelect")?.value || "";
      fetchAndDisplayListings(isChecked, selectedTag);
    });
  }
}

function setupTagFilter() {
  const tagSelect = document.getElementById("tagSelect");

  if (tagSelect) {
    tagSelect.addEventListener("change", (event) => {
      const selectedTag = event.target.value;
      const isChecked = document.getElementById("filterToggle").checked;
      fetchAndDisplayListings(isChecked, selectedTag);
    });
  }
}

// Init
fetchAndDisplayListings(true);
setupFilterToggle();
setupTagFilter();
