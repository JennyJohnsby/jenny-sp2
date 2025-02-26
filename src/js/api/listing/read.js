export async function readListing(
  id,
  includeSeller = false,
  includeBids = false,
) {
  if (!id) {
    throw new Error("Listing ID is required.");
  }

  // Construct the base URL
  let url = `https://v2.api.noroff.dev/auction/listings/${id}`;
  const params = [];

  // Add query parameters if necessary
  if (includeSeller) params.push("_seller=true");
  if (includeBids) params.push("_bids=true");

  // If we have query parameters, append them to the URL
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

    // Fetch the response body and return only the 'data' part
    const result = await response.json();

    // If bids are included, ensure that the bids data is included
    if (includeBids && result.data && !result.data.bids) {
      throw new Error("Bids data is missing in the response.");
    }

    return result.data; // Return only the 'data' object, which should contain the listing details
  } catch (error) {
    console.error("Error fetching listing:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
}
