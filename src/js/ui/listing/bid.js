import { createBid } from "../../api/listing/bid";

document.addEventListener("DOMContentLoaded", () => {
  const bidForm = document.getElementById("bidForm");
  const bidInput = document.getElementById("bidAmount");
  const listingId = new URLSearchParams(window.location.search).get("id");
  const successBanner = document.getElementById("successBanner");
  const errorBanner = document.getElementById("errorBanner");

  if (!bidForm || !bidInput || !listingId) return;

  bidForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const bidAmount = parseFloat(bidInput.value);

    if (isNaN(bidAmount) || bidAmount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    try {
      await createBid(listingId, bidAmount);
      bidInput.value = "";

      if (successBanner) {
        successBanner.style.display = "block";
        setTimeout(() => (successBanner.style.display = "none"), 3000);
      }

      bidInput.disabled = true;
      bidForm.querySelector('button[type="submit"]').disabled = true;
    } catch (error) {
      console.error("Bid submission failed:", error);

      if (errorBanner) {
        errorBanner.style.display = "block";
        setTimeout(() => (errorBanner.style.display = "none"), 3000);
      }
    }
  });
});
