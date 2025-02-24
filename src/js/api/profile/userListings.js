import { API_PROFILE_LISTINGS, API_KEY } from "../constants";

// Function to fetch all listings created by a specific user
export async function fetchUserListings() {
  // Get user info from localStorage
  const userInLocalStorage = JSON.parse(localStorage.getItem("currentUser"));
  const usernameFromStorage = userInLocalStorage
    ? userInLocalStorage.name
    : null;
  const token = localStorage.getItem("authToken");

  // If no username or token is found, log error and return an empty array
  if (!usernameFromStorage || !token) {
    console.error("No username or token found in localStorage. Please log in.");
    return [];
  }

  // Construct the API URL for the listings of the specific user
  const url = `${API_PROFILE_LISTINGS.replace("<name>", usernameFromStorage)}`; // Using the username to fetch listings

  try {
    // Fetch the user's listings from the API
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Authorization token for the user
        "X-Noroff-API-Key": API_KEY, // API Key for authentication
      },
    });

    // If the response status is not OK, handle different cases
    if (!response.ok) {
      if (response.status === 401) {
        console.error("Unauthorized access. Please log in again.");
      } else if (response.status === 404) {
        console.error(`No listings found for ${usernameFromStorage}.`);
      } else {
        console.error(
          `Failed to fetch listings for ${usernameFromStorage}: ${response.statusText}`,
        );
      }
      return [];
    }

    // Parse and return the listings data
    const { data } = await response.json();
    console.log("Listings fetched:", data);

    return data; // This will be the user's listings
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
}
