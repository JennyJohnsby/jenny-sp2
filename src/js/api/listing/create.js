export async function createListing({
  title,
  description,
  tags,
  media,
  endsAt,
}) {
  const apiUrl = "https://v2.api.noroff.dev/auction/listings";
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No token found. Please log in.");
  }

  if (!title || !endsAt) {
    throw new Error("Title and endsAt are required.");
  }

  const endDate = new Date(endsAt);
  if (isNaN(endDate.getTime())) {
    throw new Error("Invalid endsAt date.");
  }

  const isValidMediaUrls =
    media &&
    media.every((item) => /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(item.url));
  if (media && !isValidMediaUrls) {
    throw new Error("One or more media URLs are invalid.");
  }

  const listingData = {
    title,
    description: description || "",
    media: media || [],
    endsAt: endDate.toISOString(),
    tags: tags && tags.length > 0 ? [...tags, "auction"] : ["auction"],
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": "a2f8ed82-91e0-4a89-8fb8-c1e6ff355869",
      },
      body: JSON.stringify(listingData),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`Error: ${errorDetails.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create listing:", error);
    throw error;
  }
}
