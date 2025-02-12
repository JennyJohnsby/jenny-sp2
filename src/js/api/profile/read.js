import { API_PROFILES, API_KEY } from "../../api/constants";

// Function to fetch profile data
export async function readProfile() {
  // Get user info from localStorage
  const userInLocalStorage = JSON.parse(localStorage.getItem("currentUser"));
  const usernameFromStorage = userInLocalStorage
    ? userInLocalStorage.name
    : null;
  const token = localStorage.getItem("authToken");

  // If no username or token is found, log error and return null
  if (!usernameFromStorage || !token) {
    console.error("No username or token found in localStorage. Please log in.");
    return null;
  }

  // Construct URL for the profile API endpoint
  const url = `${API_PROFILES}/${usernameFromStorage}`;

  try {
    // Fetch profile data from the API
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    // If the response status is not in the 200 range, handle different cases
    if (!response.ok) {
      // If unauthorized (401), notify the user
      if (response.status === 401) {
        console.error("Unauthorized access. Please log in again.");
      } else if (response.status === 404) {
        // If the profile is not found (404), notify the user
        console.error(`Profile for ${usernameFromStorage} not found.`);
      } else {
        // Generic error message for other HTTP errors
        console.error(
          `Failed to fetch profile for ${usernameFromStorage}: ${response.statusText}`,
        );
      }
      return null;
    }

    // Parse the response JSON
    const { data } = await response.json();
    console.log("Profile data fetched:", data);

    // Return the profile data
    return data;
  } catch (error) {
    // Catch network or other unexpected errors
    console.error("Error fetching profile:", error);
    return null;
  }
}
