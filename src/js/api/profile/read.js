import { API_PROFILE, API_KEY } from "../constants";

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

  // Use the correct URL constant to fetch the profile
  const url = `${API_PROFILE}/${usernameFromStorage}`; // API endpoint for a single profile

  try {
    // Fetch profile data from the API
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Authorization token
        "X-Noroff-API-Key": API_KEY, // API Key for authentication
      },
    });

    // If the response status is not in the 200 range, handle different cases
    if (!response.ok) {
      // Handle unauthorized or not found errors
      if (response.status === 401) {
        console.error("Unauthorized access. Please log in again.");
      } else if (response.status === 404) {
        console.error(`Profile for ${usernameFromStorage} not found.`);
      } else {
        console.error(
          `Failed to fetch profile for ${usernameFromStorage}: ${response.statusText}`,
        );
      }
      return null;
    }

    // Parse and return the profile data
    const { data } = await response.json();
    console.log("Profile data fetched:", data);

    return data;
  } catch (error) {
    // Handle unexpected errors
    console.error("Error fetching profile:", error);
    return null;
  }
}
