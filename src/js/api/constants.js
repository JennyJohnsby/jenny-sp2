// ✅ Store API Key & Base URLs
export const API_KEY = "95144b64-e941-4738-b289-cc867b27e27c";
export const API_BASE = "https://v2.api.noroff.dev";

// Authentication API endpoints
export const API_AUTH = `${API_BASE}/auth`;
export const API_AUTH_LOGIN = `${API_AUTH}/login`;
export const API_AUTH_REGISTER = `${API_AUTH}/register`;
export const API_AUTH_KEY = `${API_AUTH}/create-api-key`;

// Profile API endpoints (no need to update this, it's correct as per new documentation)
export const API_PROFILE = `${API_BASE}/auction/profiles`; // Endpoint to retrieve all profiles
export const API_PROFILE_SINGLE = `${API_BASE}/auction/profiles/<name>`; // Endpoint to retrieve a single profile by name

// Listings API endpoints
export const API_LISTINGS = `${API_BASE}/auction/listings`; // Endpoint for auction listings

// Additional endpoints if needed for profile-related data
export const API_PROFILE_LISTINGS = `${API_BASE}/auction/profiles/<name>/listings`; // Listings by a specific profile
export const API_PROFILE_BIDS = `${API_BASE}/auction/profiles/<name>/bids`; // Bids made by a specific profile
export const API_PROFILE_WINS = `${API_BASE}/auction/profiles/<name>/wins`; // Wins by a specific profile

// Searching profiles
export const API_PROFILE_SEARCH = `${API_BASE}/auction/profiles/search`; // Search for profiles by name or bio
