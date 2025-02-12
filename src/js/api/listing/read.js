export async function fetchListingDetails() {
  const params = new URLSearchParams(window.location.search);
  const listingId = params.get("id");

  if (!listingId) {
    console.error("No listing ID found in URL.");
    return null;
  }

  const url = `https://v2.api.noroff.dev/auction/listings/${listingId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch listing details.");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching listing details:", error);
    return null;
  }
}
