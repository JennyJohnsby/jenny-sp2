import { API_CREATE_BID, API_KEY } from "../constants";
import { displayBanner } from "../../utilities/banners";

const sendBidToAPI = async (listingId, amount, accessToken) => {
  const url = `${API_CREATE_BID}/${listingId}/bids`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify({ amount }),
    });

    return response;
  } catch (error) {
    console.error("Error sending bid to API:", error);
    throw new Error("Error sending bid to API. Please try again.");
  }
};

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
      if (!handleBidResponse(response)) return;
    } else {
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
