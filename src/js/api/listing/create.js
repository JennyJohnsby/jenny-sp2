export async function createListing({
  title,
  description,
  tags,
  media,
  endsAt,
}) {
  const url = "https://v2.api.noroff.dev/auction/listings";
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No token found. Please log in.");
  }

  if (!title) {
    throw new Error("Title is required.");
  }

  if (!endsAt) {
    throw new Error("EndsAt date is required.");
  }

  const endDate = new Date(endsAt);
  if (isNaN(endDate.getTime())) {
    throw new Error(
      "Invalid 'endsAt' date format. Please provide a valid ISO date.",
    );
  }

  const safeMedia = Array.isArray(media) ? media : [];
  const safeDescription = description ? description.substring(0, 280) : "";

  const listingData = {
    title,
    description: safeDescription,
    tags: tags ? [...tags] : [],
    media: safeMedia,
    endsAt,
  };

  console.log("Listing Data:", listingData);

  try {
    const response = await fetch(url, {
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
      console.error("API Error Details:", errorDetails);
      throw new Error(
        `API Error: ${errorDetails.message || response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create listing:", error.message);
    if (error.stack) {
      console.error("Error Stack:", error.stack);
    }
    throw error;
  }
}
