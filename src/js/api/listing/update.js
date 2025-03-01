export async function updateListing(id, { title, description, tags, media }) {
  const url = `https://v2.api.noroff.dev/auction/listings/${id}`;

  console.log("Updating Listing:", { id, title, description, tags, media });

  const accessToken =
    localStorage.getItem("accessToken") || localStorage.getItem("authToken");

  if (!accessToken) {
    console.error("No token found. Redirecting to login.");
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
    throw new Error("No token found. Please log in.");
  }

  if (!title || title.trim() === "") {
    console.error("Title is required.");
    throw new Error("Title is required.");
  }

  const listingData = {
    title: title.trim(),
    description: description?.trim() || "",
    tags: Array.isArray(tags) ? tags.map((tag) => tag.trim()) : [],
    media: Array.isArray(media) && media.length > 0 ? media : [],
  };

  console.log("Final Listing Data to Send:", listingData);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": "95144b64-e941-4738-b289-cc867b27e27c",
      },
      body: JSON.stringify(listingData),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("API Error:", errorDetails);
      throw new Error(`Error: ${errorDetails.message || response.statusText}`);
    }

    const updatedListing = await response.json();
    console.log("Updated Listing Response:", updatedListing);
    return updatedListing;
  } catch (error) {
    console.error("Failed to update listing:", error);
    throw error;
  }
}
