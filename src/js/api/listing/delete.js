export async function deleteListing(listingId) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found.");
  }

  const response = await fetch(
    `https://v2.api.noroff.dev/auction/listings/${listingId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (response.status !== 204) {
    throw new Error(`Failed to delete listing: ${response.statusText}`);
  }

  return;
}
