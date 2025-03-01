import { createBid } from "../../api/listing/bid";

document.addEventListener("DOMContentLoaded", () => {
  const bidForm = document.getElementById("bidForm");
  const bidInput = document.getElementById("bidAmount");
  const listingId = new URLSearchParams(window.location.search).get("id");
  const successBanner = document.getElementById("successBanner"); // Assume you have a success banner element
  const errorBanner = document.getElementById("errorBanner"); // Assume you have an error banner element

  if (!bidForm || !bidInput || !listingId) return; // Ensure the elements exist

  bidForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent page refresh

    const bidAmount = parseFloat(bidInput.value); // Convert input value to a number

    if (isNaN(bidAmount) || bidAmount <= 0) {
      alert("Please enter a valid bid amount."); // Basic validation
      return;
    }

    try {
      // Place the bid using the createBid function
      await createBid(listingId, bidAmount);

      // Clear the input field after successful bid
      bidInput.value = "";

      // Show success message and hide the error banner (if any)
      if (successBanner) {
        successBanner.style.display = "block";
        setTimeout(() => (successBanner.style.display = "none"), 3000); // Hide the success message after 3 seconds
      }

      // Optionally, disable the form or input fields if needed
      bidInput.disabled = true;
      bidForm.querySelector('button[type="submit"]').disabled = true;
    } catch (error) {
      console.error("Bid submission failed:", error);

      // Show error message if something goes wrong
      if (errorBanner) {
        errorBanner.style.display = "block";
        setTimeout(() => (errorBanner.style.display = "none"), 3000); // Hide the error message after 3 seconds
      }
    }
  });
});
