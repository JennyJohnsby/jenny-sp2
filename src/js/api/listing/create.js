export async function createListing({
  title,
  description,
  tags,
  media,
  endsAt,
}) {
  const url = "https://v2.api.noroff.dev/auction/listings";

  // Get token from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Ensure that the token is available
  if (!accessToken) {
    throw new Error("No token found. Please log in.");
  }

  // Validate the 'title' and 'endsAt' fields
  if (!title) {
    throw new Error("Title is required.");
  }

  if (!endsAt) {
    throw new Error("EndsAt date is required.");
  }

  // Ensure that 'endsAt' is a valid ISO string
  const endDate = new Date(endsAt);
  if (isNaN(endDate.getTime())) {
    throw new Error(
      "Invalid 'endsAt' date format. Please provide a valid ISO date.",
    );
  }

  // Ensure 'media' is always an array (if it's null or undefined, default to empty array)
  const safeMedia = Array.isArray(media) ? media : [];

  // Ensure the 'description' is no longer than 280 characters
  const safeDescription = description ? description.substring(0, 280) : "";

  // Prepare the listing data
  const listingData = {
    title,
    description: safeDescription, // Truncate description to 280 characters if needed
    tags: tags ? [...tags] : [], // Ensure tags are an array, default to an empty array
    media: safeMedia, // Ensure media is an array (default to empty if invalid)
    endsAt, // 'endsAt' is already validated as a valid ISO string
  };

  console.log("Listing Data:", listingData); // Debugging line - log the data being sent

  try {
    // Make the API request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Use token for authentication
        "X-Noroff-API-Key": "a2f8ed82-91e0-4a89-8fb8-c1e6ff355869", // Ensure the API key is correct
      },
      body: JSON.stringify(listingData),
    });

    if (!response.ok) {
      // If the response is not ok, get the error details from the API
      const errorDetails = await response.json();
      console.error("API Error Details:", errorDetails); // Debugging line - log API error details
      throw new Error(
        `API Error: ${errorDetails.message || response.statusText}`,
      );
    }

    // Return the created listing data from the API
    return await response.json();
  } catch (error) {
    console.error("Failed to create listing:", error.message);
    if (error.stack) {
      console.error("Error Stack:", error.stack); // Debugging line - log the error stack trace
    }
    throw error; // Re-throw the error for handling in the calling function
  }
}

/**
 * Creates a new auction listing by sending the data to the API.
 *
 * @param {Object} data - The listing parameters.
 * @param {string} data.title - The title of the listing (required).
 * @param {string} [data.description] - The description of the listing (optional).
 * @param {string[]} [data.tags] - Array of tags associated with the listing (optional).
 * @param {Object[]} [data.media] - Array of media objects containing URL and alt text (optional).
 * @param {string} [data.media.url] - The URL of the media (optional).
 * @param {string} [data.media.alt] - Alt text for the media (optional).
 * @param {string} data.endsAt - The date and time the listing ends (required).
 * @returns {Promise<Object>} The created listing data from the API.
 * @throws {Error} If the API request fails.
 */
