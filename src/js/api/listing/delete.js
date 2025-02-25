import { API_KEY, API_DELETE_LISTINGS } from "../constants";
import { displayBanner } from "../../utilities/banners";

const deleteFromAPI = async (id, accessToken) => {
  const url = `${API_DELETE_LISTINGS}/${id}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });
  return response;
};

const handleAPIResponse = (response) => {
  if (response.status === 404) {
    displayBanner(
      "Listing not found. It may have already been deleted.",
      "error",
    );
    return false;
  }

  if (response.status === 204) {
    displayBanner("Listing deleted successfully!", "success");
    return true;
  }

  displayBanner("Failed to delete listing. Please try again.", "error");
  return false;
};

const removeListingFromUI = (id) => {
  const listingElement = document.getElementById(`listing-${id}`);
  if (listingElement) {
    listingElement.remove();
  }
};

const redirectToProfile = () => {
  window.location.href = "/";
};

export async function deleteListing(id) {
  if (!id) {
    displayBanner("Invalid listing ID. Please try again.", "error");
    return;
  }

  const userConfirmed = window.confirm(
    "Are you sure you want to delete this listing? This action cannot be undone.",
  );
  if (!userConfirmed) {
    displayBanner("Listing deletion canceled.", "error");
    return;
  }

  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await deleteFromAPI(id, accessToken);

    if (!handleAPIResponse(response, id)) return;

    removeListingFromUI(id);
    redirectToProfile();
  } catch {
    displayBanner(
      "An error occurred while deleting the listing. Please try again.",
      "error",
    );
  }
}
