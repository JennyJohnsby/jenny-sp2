export function displayBanner(message, type = "success", timeout) {
    // Default timeout logic if not provided
    timeout = timeout ?? getTimeoutForType(type);

    // Check for existing banners and remove them
    removeExistingBanner();

    // Create banner element (without icon or close button)
    const banner = createBannerElement(message, type);

    // Add the banner to the DOM
    document.body.insertAdjacentElement("afterbegin", banner);

    // Auto-remove the banner after the specified timeout
    if (timeout > 0) {
        setTimeout(() => {
            if (banner.parentNode) banner.remove();
        }, timeout);
    }
}

// Helper function to get timeout based on the type
function getTimeoutForType(type) {
    const timeoutMap = {
        success: 5000,
        error: 10000,
        warning: 0,
    };

    return timeoutMap[type] ?? 5000; // Default to 5 seconds if the type is unknown
}

// Helper function to remove existing banner
function removeExistingBanner() {
    const existingBanner = document.querySelector(".banner");
    if (existingBanner) {
        existingBanner.remove();
    }
}

// Helper function to create the banner element (without icon or close button)
function createBannerElement(message, type) {
    const banner = document.createElement("div");
    banner.className = `banner banner--${type}`;
    banner.setAttribute("role", "alert");
    banner.setAttribute("aria-live", "assertive");  // Let screen readers know the content is important
    banner.innerHTML = message;

    return banner;
}
