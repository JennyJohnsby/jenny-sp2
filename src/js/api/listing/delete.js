import { API_KEY, API_DELETE_LISTINGS } from "../constants";
import { displayBanner } from "../../utilities/banners";

export async function deleteListing(id) {
  if (!id) {
    console.error("Error: Listing ID is undefined or null.");
    displayBanner("Invalid listing ID. Please try again.", "error");
    return;
  }

  const userConfirmed = window.confirm(
    "Are you sure you want to delete this listing? This action cannot be undone.",
  );

  if (!userConfirmed) {
    console.log("Listing deletion canceled by user.");
    displayBanner("Listing deletion canceled.", "error");
    return;
  }

  // ✅ Ensure the API URL is correctly formatted
  const url = `${API_DELETE_LISTINGS}/${id}`; // Assuming `${API_DELETE_LISTINGS}` is "/auction/listings"
  const accessToken = localStorage.getItem("accessToken");

  try {
    console.log(`🔹 Attempting to delete listing with ID: ${id}`);
    console.log(`🔹 API Endpoint: ${url}`);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    console.log("🔹 Response status:", response.status);

    // Handle response status
    if (response.status === 404) {
      console.warn("⚠️ Listing not found. It may have already been deleted.");
      displayBanner(
        "Listing not found. It may have already been deleted.",
        "error",
      );
      return;
    }

    if (response.status === 204) {
      console.log(`✅ Listing with ID ${id} deleted successfully.`);
      displayBanner("Listing deleted successfully!", "success");

      // ✅ Remove listing from UI (if it exists)
      const listingElement = document.getElementById(`listing-${id}`);
      if (listingElement) {
        listingElement.remove();
      }
      return;
    }

    console.error(
      "❌ Failed to delete listing. Unexpected response:",
      response,
    );
    displayBanner("Failed to delete listing. Please try again.", "error");
  } catch (error) {
    console.error("❌ Error deleting listing:", error);
    displayBanner(
      "An error occurred while deleting the listing. Please try again.",
      "error",
    );
  }
}
