export async function readListing(
  id,
  includeSeller = false,
  includeBids = false,
) {
  if (!id) {
    throw new Error("Listing ID is required.");
  }

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

    if (includeBids && result.data && !result.data.bids) {
      throw new Error("Bids data is missing in the response.");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching listing:", error);
    throw error;
  }
}
