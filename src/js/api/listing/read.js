/**
 * Fetches a single listing by its ID.
 *
 * @param {string} id - The ID of the listing to retrieve.
 * @param {boolean} [includeSeller=false] - Whether to include seller information.
 * @param {boolean} [includeBids=false] - Whether to include bid count.
 * @returns {Promise<object>} The listing data.
 * @throws {Error} If the API request fails.
 */
export async function readListing(
  id,
  includeSeller = false,
  includeBids = false,
) {
  if (!id) {
    throw new Error("Listing ID is required.");
  }

  // Construct API URL with optional query parameters
  let url = `https://v2.api.noroff.dev/auction/listings/${id}`;
  const params = [];

  if (includeSeller) params.push("_seller=true");
  if (includeBids) params.push("_bids=true");

  if (params.length) {
    url += `?${params.join("&")}`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(
        errorDetails.message ||
          `Failed to fetch listing (Status: ${response.status})`,
      );
    }

    const result = await response.json();
    return result.data; // ✅ Return only the "data" property
  } catch (error) {
    console.error("Error fetching listing:", error);
    throw error; // Re-throw for handling at a higher level
  }
}
