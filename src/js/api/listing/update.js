export async function updateListing(listingId, updatedData) {
  const payload = {};

  if (updatedData.title) payload.title = updatedData.title;
  if (updatedData.description) payload.description = updatedData.description;
  if (updatedData.tags) payload.tags = updatedData.tags;

  if (updatedData.media) {
    payload.media = updatedData.media.map((item) => ({
      url: item.url,
      alt: item.alt,
    }));
  }

  const response = await fetch(`/auction/listings/${listingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update listing");
  }

  return await response.json();
}
