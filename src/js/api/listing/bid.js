import { API_CREATE_BID, API_KEY } from "../constants"; // Adjust the import based on your constants
import { displayBanner } from "../../utilities/banners";

// Function to send the bid request to the API
const sendBidToAPI = async (listingId, amount, accessToken) => {
  const url = `${API_CREATE_BID}/${listingId}/bids`; // Complete the endpoint with listingId and /bids
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY, // Adjust the API Key if needed
      },
      body: JSON.stringify({ amount }),
    });

    return response; // Return the API response
  } catch (error) {
    console.error("Error sending bid to API:", error);
    throw new Error("Error sending bid to API. Please try again.");
  }
};

// Handle API response for placing a bid
const handleBidResponse = (response) => {
  if (response.status === 404) {
    displayBanner(
      "Listing not found. It may have already been closed.",
      "error",
    );
    return false;
  }

  if (response.status === 200) {
    displayBanner("Bid placed successfully!", "success");
    return true;
  }

  if (response.status === 403) {
    displayBanner("You don't have permission to place a bid.", "error");
    return false;
  }
};

// Function to handle placing a bid
export async function createBid(listingId, amount) {
  if (!listingId || !amount) {
    displayBanner("Invalid listing ID or bid amount.", "error");
    return;
  }

  if (amount <= 0) {
    displayBanner("Bid amount must be greater than zero.", "error");
    return;
  }

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    displayBanner("No token found. Please log in to place a bid.", "error");
    return;
  }

  try {
    const response = await sendBidToAPI(listingId, amount, accessToken);

    if (response.ok) {
      // Check if the response was successful
      if (!handleBidResponse(response)) return;

      // You could update UI or do other things after successfully placing the bid
    } else {
      // Handle response error if not ok
      const errorDetails = await response.json();
      displayBanner(
        `API Error: ${errorDetails.message || response.statusText}`,
        "error",
      );
    }
  } catch (error) {
    console.error("Error placing bid:", error);
    displayBanner(
      "An error occurred while placing the bid. Please try again.",
      "error",
    );
  }
}
