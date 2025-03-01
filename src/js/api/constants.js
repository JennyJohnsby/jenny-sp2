export const API_KEY = "95144b64-e941-4738-b289-cc867b27e27c";
export const API_BASE = "https://v2.api.noroff.dev";

export const API_AUTH = `${API_BASE}/auth`;
export const API_AUTH_LOGIN = `${API_AUTH}/login`;
export const API_AUTH_REGISTER = `${API_AUTH}/register`;
export const API_AUTH_KEY = `${API_AUTH}/create-api-key`;

export const API_PROFILE = `${API_BASE}/auction/profiles`;
export const API_PROFILE_SINGLE = `${API_BASE}/auction/profiles/<name>`;

export const API_LISTINGS = `${API_BASE}/auction/listings`;
export const API_DELETE_LISTINGS = `${API_BASE}/auction/listings`;
export const API_CREATE_BID = `${API_BASE}/auction/listings`;

export const API_PROFILE_LISTINGS = `${API_BASE}/auction/profiles/<name>/listings`;
export const API_PROFILE_BIDS = `${API_BASE}/auction/profiles/<name>/bids`;
export const API_PROFILE_WINS = `${API_BASE}/auction/profiles/<name>/wins`;

export const API_PROFILE_SEARCH = `${API_BASE}/auction/profiles/search`;
