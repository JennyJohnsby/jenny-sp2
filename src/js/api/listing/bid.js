import axios from "axios";

const placeBid = async (listingId, bidAmount) => {
  if (bidAmount <= 0) {
    throw new Error("Bid amount must be greater than 0");
  }

  try {
    const payload = { amount: bidAmount };
    const response = await axios.post(
      `/auction/listings/${listingId}/bids`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error placing bid:",
      error.response ? error.response.data : error.message,
    );
    throw new Error("Failed to place bid. Please try again.");
  }
};

export default placeBid;
