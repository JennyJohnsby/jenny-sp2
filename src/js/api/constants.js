// API Key and Base URL
export const API_KEY = "c3a34960-0ec1-4c73-bb95-776b2c85f03a";
export const API_BASE = "https://v2.api.noroff.dev";

// Authentication API endpoints
export const API_AUTH = `${API_BASE}/auth`;
export const API_AUTH_LOGIN = `${API_AUTH}/login`;
export const API_AUTH_REGISTER = `${API_AUTH}/register`;
export const API_AUTH_KEY = `${API_AUTH}/create-api-key`;

// Auction-related API endpoints
export const API_AUCTION = `${API_BASE}/auction`;
export const API_AUCTION_LISTINGS = `${API_AUCTION}/listings`;
export const API_PROFILE = `${API_BASE}/auction/profiles`;

/**
 * Get all listings with optional pagination, filtering, and sorting.
 *
 * @param {Object} options - Optional query parameters
 * @param {number} options.page - The page number for pagination (default: 1)
 * @param {number} options.limit - Number of listings per page (default: 10)
 * @param {boolean} options.active - If true, fetches only active listings
 * @param {string} options.tag - Filters listings by a specific tag
 * @returns {string} - The constructed API endpoint URL
 */
export const API_LISTINGS_PAGINATED = ({
  page = 1,
  limit = 10,
  active,
  tag,
} = {}) => {
  const params = new URLSearchParams({ _page: page, _limit: limit });
  if (active) params.append("_active", true);
  if (tag) params.append("_tag", tag);
  return `${API_AUCTION_LISTINGS}?${params}`;
};

/**
 * Get details of a single listing.
 *
 * @param {string} listingId - The ID of the listing
 * @param {Object} options - Optional query parameters
 * @param {boolean} options.seller - If true, includes seller information
 * @param {boolean} options.bids - If true, includes bid details
 * @returns {string} - The constructed API endpoint URL
 */
export const API_LISTING_DETAILS = (
  listingId,
  { seller = false, bids = false } = {},
) => {
  const params = new URLSearchParams();
  if (seller) params.append("_seller", true);
  if (bids) params.append("_bids", true);
  return `${API_AUCTION_LISTINGS}/${listingId}?${params}`;
};

// Search listings by title or description
export const API_AUCTION_LISTINGS_SEARCH = (query) =>
  `${API_AUCTION_LISTINGS}/search?q=${encodeURIComponent(query)}`;

// Create a new listing (POST request)
export const API_CREATE_LISTING = API_AUCTION_LISTINGS;

// Update an existing listing (PUT request)
export const API_UPDATE_LISTING = (listingId) =>
  `${API_AUCTION_LISTINGS}/${listingId}`;

// Delete a listing (DELETE request)
export const API_DELETE_LISTING = (listingId) =>
  `${API_AUCTION_LISTINGS}/${listingId}`;

// Place a bid on a listing (POST request)
export const API_BID_ON_LISTING = (listingId) =>
  `${API_AUCTION_LISTINGS}/${listingId}/bids`;

// Base URL for user profiles
export const API_PROFILES = `${API_BASE}/profiles`;

/**
 * Get details of a specific user profile.
 *
 * @param {string} profileName - The username of the profile
 * @returns {string} - The constructed API endpoint URL
 */
export const API_PROFILE_DETAILS = (profileName) =>
  `${API_PROFILES}/${profileName}`;

/**
 * Get all listings created by a specific user.
 * Supports pagination.
 *
 * @param {string} profileName - The username of the profile
 * @param {number} page - The page number for pagination (default: 1)
 * @param {number} limit - Number of listings per page (default: 10)
 * @returns {string} - The constructed API endpoint URL
 */
export const API_PROFILE_LISTINGS = (profileName, page = 1, limit = 12) =>
  `${API_PROFILES}/${profileName}/listings?${new URLSearchParams({
    _page: page,
    _limit: limit,
  })}`;

/**
 * Get all bids placed by a specific user.
 * Supports pagination.
 *
 * @param {string} profileName - The username of the profile
 * @param {number} page - The page number for pagination (default: 1)
 * @param {number} limit - Number of bids per page (default: 10)
 * @returns {string} - The constructed API endpoint URL
 */
export const API_PROFILE_BIDS = (profileName, page = 1, limit = 10) =>
  `${API_PROFILES}/${profileName}/bids?${new URLSearchParams({
    _page: page,
    _limit: limit,
  })}`;
